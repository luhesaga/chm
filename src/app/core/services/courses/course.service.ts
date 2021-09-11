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

  listRegisteredUsers(courseId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${courseId}/matriculados`, ref =>
      ref.orderBy('nombre', 'asc'));
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

  registerUserToCourse(data: any, courseId: string, stdId: string): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${stdId}`)
      .set({
        id: stdId,
        nombre: data.stdName,
        fechaMatricula: data.fechaMatricula,
        tipoMatricula: data.tipoMatricula,
        fechaFinalizacionMatricula: data.fechaFinalizacionMatricula
      })
  }

  updateUserOfCourse(data: any, courseId: string, stdId: string): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${stdId}`)
      .update({
        fechaMatricula: data.fechaMatricula,
        tipoMatricula: data.tipoMatricula,
        fechaFinalizacionMatricula: data.fechaFinalizacionMatricula
      })
  }

  deleteUserFromCourse(idCurso: string, idEstudiante: string) {
    return this.fireStore.doc(`cursos/${idCurso}/matriculados/${idEstudiante}`).delete();
  }

  getRegisteredUSers(idCurso: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${idCurso}/matriculados`);
  }

  createAnuncio(data: any, courseId: string, idAnuncio: string): Promise<void> {
    let fecha = new Date().toUTCString();
    return this.fireStore.doc(`cursos/${courseId}/anuncios/${idAnuncio}`)
      .set({
        id: idAnuncio,
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha
      })
  }

  obtenerAnuncios(idCurso: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${idCurso}/anuncios`, ref =>
      ref.orderBy('fecha', 'asc'));
  }

  deleteAnuncio(courseId: string, idAnuncio: string): Promise<any> {
    return this.fireStore.doc(`cursos/${courseId}/anuncios/${idAnuncio}`).delete();
  }

  obtenerAnuncio(idCurso: string, idAnuncio: string): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${idCurso}/anuncios/${idAnuncio}`);
  }

  editarAnuncio(data: any, courseId: string, idAnuncio: string, dateUpdate: boolean, date: string): Promise<void> {
    let fecha;
    if (dateUpdate) {
      fecha = new Date().toUTCString();
    } else {
      fecha = date;
    }
    return this.fireStore.doc(`cursos/${courseId}/anuncios/${idAnuncio}`)
      .update({
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha
      })
  }

  createDocuments(idCurso:string, idDocument:string, data:any): Promise<any> {
    return this.fireStore.doc(`cursos/${idCurso}/documents/${idDocument}`)
    .set({
      id:idDocument,
      nombreArchivo: data.nombreArchivo,
      archivo: data.archivo
    });
  }

  getDocuments(idCurso:string): AngularFirestoreCollection<any> {
    return this.fireStore.collection(`cursos/${idCurso}/documents`);
  }

  deleteDocuments(idCurso:string, idDocument:string): Promise<any> {
    return this.fireStore.doc(`cursos/${idCurso}/documents/${idDocument}`)
    .delete();
  }
}
