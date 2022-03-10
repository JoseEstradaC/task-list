import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api/menuitem';
import { Observable } from 'rxjs';
import { Nota } from './nota';
import { NotaService } from './nota.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService],
})
export class AppComponent {
  notas: Observable<Nota[]>;

  NotaForm = new FormGroup({
    notaId: new FormControl(''),
    titulo: new FormControl(''),
    descripcion: new FormControl(''),
    estado: new FormControl(false),
  });

  notaSelecionada: Nota;
  items: MenuItem[];

  formButtonText: string;
  displayNotaForm = false;

  constructor(
    public notaService: NotaService,
    private messageService: MessageService
  ) {
    this.notas = this.notaService.getNotas();

    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.updateNoteStep1(this.notaSelecionada.notaId),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => this.deleteNota(this.notaSelecionada),
      },
    ];
  }

  addNota() {
    if (this.formButtonText == 'Actualizar tarea') this.updateNoteStep2();
    else {
      this.notaService.addNota(this.NotaForm.value);
      this.messageService.add({ severity: 'info', summary: 'Tarea creada' });
    }

    this.NotaForm.reset({ titulo: '', descripcion: '', estado: false });
  }

  updateNoteStep1(id: string) {
    this.notaService.getNota(id).subscribe((data) => {
      this.NotaForm.patchValue(data);
      console.log('data: ' + JSON.stringify(data));
    });
    this.displayNotaForm = true;
    this.formButtonText = 'Actualizar tarea';
  }

  updateNoteStep2() {
    this.messageService.add({ severity: 'info', summary: 'Tarea editada' });
    this.notaService.updateNota(this.NotaForm.value);
  }

  formSubmit() {
    this.addNota();
    this.displayNotaForm = false;
  }

  deleteNota(nota: Nota) {
    this.messageService.add({ severity: 'info', summary: 'Tarea eliminada' });
    this.notaService.deleteNota(nota.notaId);
  }
}
