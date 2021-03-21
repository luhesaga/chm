import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(public fireStore: AngularFirestore) { }

  listCourses(): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos`, ref =>
      ref.orderBy('nombre', 'asc'));
  }

  detailCourse(id): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${id}`);
  }

  createCourse(data, id, imgName): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`)
      .set({
          id,
          nombre: data.name,
          introduccion: data.introduction,
          objetivo: data.objetive,
          descripcion: data.description,
          imagen: data.image,
          nombreImg: imgName
        });
  }
}
