import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(public fireStore: AngularFirestore) { }

  listLessons(id): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${id}/lecciones`, ref =>
      ref.orderBy('posicion', 'asc'));
  }

  createLesson(data): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`cursos/${data.id}/lecciones/${id}`)
      .set({
          id,
          nombre: data.name,
          posicion: data.position
        });
  }
}
