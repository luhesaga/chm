import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(public fireStore: AngularFirestore) { }

  courseInLog(data) {
    const log = this.getCourseInLog(data)
      .valueChanges()
      .subscribe(l => {
        if (l) {
          this.updateCourseInLog(data);
        } else {
          this.setCourseInLog(data);
        }
        log.unsubscribe();
      })
  }

  setCourseInLog(data) {
    return this.fireStore.doc(`logs/cursos/${data.curso}/${data.estudiante}`)
      .set({
        curso: data.curso,
        estudiante: data.estudiante,
        fechaIngreso: data.fechaIngreso
      });
  }

  updateCourseInLog(data) {
    return this.fireStore.doc(`logs/cursos/${data.curso}/${data.estudiante}`)
      .update({fechaIngreso: data.fechaIngreso});
  }

  getCourseInLog(data): AngularFirestoreDocument {
    return this.fireStore.doc(`logs/cursos/${data.curso}/${data.estudiante}`);
  }
}
