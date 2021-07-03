import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {

  constructor(public fireStore: AngularFirestore) { }

  listGlossary(courseId): AngularFirestoreCollection {
    return this.fireStore.collection(`glosario/${courseId}/glosario`, ref =>
    ref.orderBy('termino'));
  }

  createTerm(data, courseId): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`glosario/${courseId}/glosario/${id}`)
      .set({
          id,
          termino: data.term,
          definicion: data.definition,
        });
  }

  editTerm(data, courseId: string, termId: string): Promise<void> {
    return this.fireStore.doc(`glosario/${courseId}/glosario/${termId}`)
      .update({
        termino: data.term,
        definicion: data.definition,
      });
  }

  deleteTerm(courseId: string, termId: string): Promise<void> {
    return this.fireStore.doc(`glosario/${courseId}/glosario/${termId}`).delete();
  }
}
