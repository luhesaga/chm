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
export class CourseService {

  constructor(public fireStore: AngularFirestore) { }

  listCourses(): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos`, ref =>
      ref.orderBy('nombre', 'asc'));
  }

  listCoursesByUser(courseId, userId): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${userId}`);
  }

  coursesByCategory(category: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos`, ref =>
      ref.where('categoria', '==', category));
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

  editCourseOptions(id, options): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`)
      .update({
          opciones: options
      });
  }

  deleteCourseDescriptionField(id, type): Promise<void> {
    const FieldValue = firebase.firestore.FieldValue;
    return this.fireStore.doc(`cursos/${id}`)
      .update({
          [type]: FieldValue.delete()
      });
  }

  deleteCategory(id) {
    return this.fireStore.doc(`cursos/${id}`)
      .update({
        categoria: firebase.firestore.FieldValue.delete()
      })
  }

  addEnrolledStudents(students:any, idCurso:string, idEstudiante: string):void
  {
    this.fireStore.doc(`cursos/${idCurso}/matriculados/${idEstudiante}`)
    .set({
      id:idEstudiante,
      nombre: students
    })
  }

  deleteEnrolledStudent(idCurso:string, idEstudiante: string)
  {
    return this.fireStore.doc(`cursos/${idCurso}/matriculados/${idEstudiante}`).delete();
  }

  obtenerEstudiantesMatriculados(idCurso:string): AngularFirestoreCollection
  {
    return this.fireStore.collection(`cursos/${idCurso}/matriculados`);
  }
}
