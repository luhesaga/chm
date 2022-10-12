import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(public fireStore: AngularFirestore) {}

  forumAnswer(data: any, courseId, lessonId, contentId) {
    const answerId = this.fireStore.createId();
    const fecha = new Date().toUTCString();
    this.fireStore
      .doc(
        `cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/respuestas-foro/${data.id}/respuestas-user/${answerId}`
      )
      .set({
        tiempo: data.tiempo,
        fecha,
        tipo: data.tipo,
        contenido: data.contenido,
        nombreCompleto: data.nombreCompleto,
        usuarioId: data.id,
        id: answerId,
        valor: data.calificacion,
      });
  }

  editForumAnswer(data: any, courseId, lessonId, contentId, userId, foroId) {
    this.fireStore
      .doc(
        `cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/respuestas-foro/${userId}/respuestas-user/${foroId}`
      )
      .update({
        contenido: data,
      });
  }

  setForumRevition(data: any, courseId, lessonId, contentId, userId, foroId) {
    return this.fireStore
      .doc(
        `cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/respuestas-foro/${userId}/respuestas-user/${foroId}`
      )
      .update({
        valor: data.valor,
        estado: data.estado,
        calificado: true,
      });
  }

  getDetailAnswer(courseId, lessonId, contentId, userId, foroId) {
    return this.fireStore.doc(
      `cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/respuestas-foro/${userId}/respuestas-user/${foroId}`
    );
  }

  deleteUserAnswer(courseId, lessonId, contentId, userId, foroId) {
    return this.fireStore
      .doc(
        `cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/respuestas-foro/${userId}/respuestas-user/${foroId}`
      )
      .delete();
  }

  getUserAnswers(courseId, lessonId, contentId, stdId) {
    return this.fireStore.collection(
      `cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/respuestas-foro/${stdId}/respuestas-user/`
    );
  }
}
