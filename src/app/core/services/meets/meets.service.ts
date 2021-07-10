import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MeetsService {

  constructor(public fireStore: AngularFirestore) { }

  createMeet(data, courseId): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`meets/${courseId}/meets/${id}`)
      .set({
          id,
          nombre: data.name,
          url: data.url,
          descripcion: data.description
        });
  }

  editMeet(data, courseId: string, meetId: string): Promise<void> {
    return this.fireStore.doc(`meets/${courseId}/meets/${meetId}`)
      .update({
          nombre: data.name,
          url: data.url,
          descripcion: data.description
      });
  }

  deleteMeet(courseId: string, meetId: string): Promise<void> {
    return this.fireStore.doc(`meets/${courseId}/meets/${meetId}`).delete();
  }

  listMeets(courseId): AngularFirestoreCollection {
    return this.fireStore.collection(`meets/${courseId}/meets`);
  }
}
