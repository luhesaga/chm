import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(public fireStore: AngularFirestore) {}

  listCourses(): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos`, (ref) =>
      ref.orderBy('nombre', 'asc')
    );
  }

  listCoursesByUser(courseId, userId): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${userId}`);
  }

  listRegisteredUsers(courseId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${courseId}/matriculados`, (ref) =>
      ref.orderBy('nombre', 'asc')
    );
  }

  coursesByCategory(category: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos`, (ref) =>
      ref.where('categoria', '==', category)
    );
  }

  detailCourse(id): AngularFirestoreDocument<any> {
    return this.fireStore.doc(`cursos/${id}`);
  }

  createCourse(data, id, imgName): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`).set({
      id,
      nombre: data.name,
      sigla: data.initials.toUpperCase(),
      imagen: data.image,
      nombreImg: imgName,
      categoria: data.categoria,
      profesor: data.profesor,
      tipoCerticado: data.tipoCert,
      duracionCurso: data.duration,
      porcentaje: data.percentage,
      calificacionEstrellas: [],
      plantilla: data.plantilla,
      vence: data.vence,
      vencimiento: data.vencimiento,
      visible: data.visible,
      precioCOP: data.cop,
      precioUSD: data.usd,
      calendly: data.calendly,
    });
  }

  editCourse(data, id, imgName): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`).update({
      nombre: data.name,
      sigla: data.initials.toUpperCase(),
      imagen: data.image,
      nombreImg: imgName,
      categoria: data.categoria,
      profesor: data.profesor,
      tipoCerticado: data.tipoCert,
      duracionCurso: data.duration,
      porcentaje: data.percentage,
      plantilla: data.plantilla,
      vence: data.vence,
      vencimiento: data.vencimiento,
      visible: data.visible,
      precioCOP: data.cop,
      precioUSD: data.usd,
      calendly: data.calendly,
    });
  }

  editCourseDescription(id, value, type): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`).update({
      [type]: value,
    });
  }

  editCourseOptions(id, options): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`).update({
      opciones: options,
    });
  }

  deleteCourseDescriptionField(id, type): Promise<void> {
    const FieldValue = firebase.firestore.FieldValue;
    return this.fireStore.doc(`cursos/${id}`).update({
      [type]: FieldValue.delete(),
    });
  }

  deleteCategory(id): Promise<void> {
    return this.fireStore.doc(`cursos/${id}`).update({
      categoria: firebase.firestore.FieldValue.delete(),
    });
  }

  registerUserToCourse(
    data: any,
    courseId: string,
    stdId: string
  ): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${stdId}`).set({
      id: stdId,
      nombre: data.stdName,
      fechaMatricula: data.fechaMatricula,
      tipoMatricula: data.tipoMatricula,
      fechaFinalizacionMatricula: data.fechaFinalizacionMatricula,
    });
  }

  updateUserOfCourse(
    data: any,
    courseId: string,
    stdId: string
  ): Promise<void> {
    return this.fireStore
      .doc(`cursos/${courseId}/matriculados/${stdId}`)
      .update({
        fechaMatricula: data.fechaMatricula,
        tipoMatricula: data.tipoMatricula,
        fechaFinalizacionMatricula: data.fechaFinalizacionMatricula,
      });
  }

  registeredUSerDetail(
    courseId: string,
    stdId: string
  ): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${stdId}`);
  }

  courseFinish(courseId: string, stdId: string): Promise<void> {
    const fecha = new Date();
    return this.fireStore
      .doc(`cursos/${courseId}/matriculados/${stdId}`)
      .update({
        finalizado: true,
        fechaFin: fecha,
      });
  }

  deleteUserFromCourse(idCurso: string, idEstudiante: string): Promise<void> {
    return this.fireStore
      .doc(`cursos/${idCurso}/matriculados/${idEstudiante}`)
      .delete();
  }

  allowOrDenyCert(courseId: string, stdId: string, cert: boolean): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/matriculados/${stdId}`)
      .update({
        bloquearCert: cert,
      });
  }

  getRegisteredUSers(idCurso: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${idCurso}/matriculados`);
  }

  createAnuncio(data: any, courseId: string, idAnuncio: string): Promise<void> {
    const fecha = new Date();
    return this.fireStore.doc(`cursos/${courseId}/anuncios/${idAnuncio}`).set({
      id: idAnuncio,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha,
    });
  }

  obtenerAnuncios(idCurso: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${idCurso}/anuncios`, (ref) =>
      ref.orderBy('fecha', 'desc')
    );
  }

  deleteAnuncio(courseId: string, idAnuncio: string): Promise<any> {
    return this.fireStore
      .doc(`cursos/${courseId}/anuncios/${idAnuncio}`)
      .delete();
  }

  obtenerAnuncio(idCurso: string, idAnuncio: string): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${idCurso}/anuncios/${idAnuncio}`);
  }

  editarAnuncio(
    data: any,
    courseId: string,
    idAnuncio: string,
    dateUpdate: boolean,
    date: string
  ): Promise<void> {
    let fecha;
    if (dateUpdate) {
      fecha = new Date();
    } else {
      fecha = date;
    }
    return this.fireStore
      .doc(`cursos/${courseId}/anuncios/${idAnuncio}`)
      .update({
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha,
      });
  }

  createDocuments(
    idCurso: string,
    idDocument: string,
    data: any
  ): Promise<any> {
    return this.fireStore.doc(`cursos/${idCurso}/documents/${idDocument}`).set({
      id: idDocument,
      nombreArchivo: data.nombreArchivo,
      archivo: data.archivo,
    });
  }

  getDocuments(idCurso: string): AngularFirestoreCollection<any> {
    return this.fireStore.collection(`cursos/${idCurso}/documents`);
  }

  deleteDocuments(idCurso: string, idDocument: string): Promise<any> {
    return this.fireStore
      .doc(`cursos/${idCurso}/documents/${idDocument}`)
      .delete();
  }

  agregarEstrella(data): Promise<void> {
    return this.fireStore
      .doc(`cursos/${data.idCurso}/estrellas/${data.idUsuario}`)
      .set({
        calificacion: data.calificacion,
        idCurso: data.idCurso,
        idUsuario: data.idUsuario,
      });
  }

  setStarsAndVotes(data): Promise<void> {
    return this.fireStore.doc(`cursos/${data.idCurso}`).update({
      estrellas: data.estrellasAcum,
      votos: data.votosAcum,
    });
  }

  getUserStars(userdId: string, courseId: string): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos/${courseId}/estrellas/${userdId}`);
  }

  finalizarCurso(courseId: string, userId: string, porcentaje: number): Promise<void> {
    const fecha = new Date();
    return this.fireStore.doc(`cursos-finalizados/${courseId}/estudiantes/${userId}`)
      .set({
        finalizado: true,
        porcentaje,
        fechaFin: fecha,
      });
  }

  obtenerCursoFinalizado(courseId: string, userId: string): AngularFirestoreDocument {
    return this.fireStore.doc(`cursos-finalizados/${courseId}/estudiantes/${userId}`);
  }
}
