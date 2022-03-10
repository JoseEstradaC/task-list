import { Injectable } from '@angular/core';
import {
  collection, collectionData, Firestore, addDoc, deleteDoc, doc, setDoc, docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Nota } from './nota';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  constructor(private firestore: Firestore) { }

  async addNota(nota: Nota) {
    try {
      const docRef = await addDoc(collection(this.firestore, "notas"), nota);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  getNotas(): Observable<Nota[]> {
    return collectionData(collection(this.firestore, 'notas'), { idField: 'notaId' }) as Observable<Nota[]>;
  }

  async deleteNota(id: string) {
    await deleteDoc(doc(this.firestore, `notas/${id}`));
  }

  async updateNota(nota: Nota) {
    await setDoc(doc(this.firestore, `notas/${nota.notaId}`), nota);
  }

  getNota(id: string): Observable<Nota> {
    return docData(doc(this.firestore, `notas/${id}`), { idField: 'notaId' }) as Observable<Nota>;
  }
}
