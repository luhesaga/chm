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

  detailCourse(id): AngularFirestoreDocument<any> {
    return this.fireStore.doc(`cursos/${id}`);
  }

  createCourse(data, id, imgName): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`)
      .set({
          id,
          nombre: data.name,
          imagen: data.image,
          nombreImg: imgName,
          categoria: data.categoria,
          profesor: data.profesor
        });
  }

  editCourse(data, id, imgName): Promise<void> {
    console.log(data);
    console.log(imgName);
    return this.fireStore.doc(`cursos/${id}`)
      .update({
        nombre: data.name,
        imagen: data.image,
        nombreImg: imgName,
        categoria: data.categoria,
        profesor: data.profesor
      });
  }

  editCourseDescription(id, value, type): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`)
      .update({
          [type]: value
      });
  }
}
