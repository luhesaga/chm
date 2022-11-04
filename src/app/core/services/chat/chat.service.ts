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
export class ChatService {
  constructor(public fireStore: AngularFirestore) {}

  addQuestion(data: any): Promise<void> {
    const id = this.fireStore.createId();
    const fechaPregunta = new Date();
    return this.fireStore.doc(`chat/cursos/${data.idCurso}/${id}`).set({
      id,
      curso: data.nombreCurso,
      idCurso: data.idCurso,
      estudiante: data.estudiante,
      idEstudiante: data.idEstudiante,
      profesor: data.profesor,
      correoProfesor: data.correoProfesor,
      correoEstudiante: data.correoEstudiante,
      pregunta: data.pregunta,
      leida: false,
      respondida: false,
      fechaPregunta,
    });
  }

  addAnswer(
    courseId: string,
    questionId: string,
    respuesta: string
  ): Promise<void> {
    const id = this.fireStore.createId();
    const fechaRespuesta = new Date();
    return this.fireStore
      .doc(`chat/cursos/${courseId}/${questionId}/respuestas/${id}`)
      .set({
        id,
        respuesta,
        fechaRespuesta,
      });
  }

  markAsAnswered(courseId: string, questionId: string): Promise<void> {
    return this.fireStore.doc(`chat/cursos/${courseId}/${questionId}`).update({
      leida: true,
    });
  }

  deleteQuestion(courseId: string, questionId: string): Promise<void> {
    return this.fireStore.doc(`chat/cursos/${courseId}/${questionId}`).delete();
  }

  deleteAnswer(courseId: string, questionId: string, answerId: string): Promise<void> {
    return this.fireStore.doc(`chat/cursos/${courseId}/${questionId}/respuestas/${answerId}`).delete();
  }

  getStdQuestions(courseId: string, stdId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`chat/cursos/${courseId}`, (ref) =>
      ref
        .where('idEstudiante', '==', `${stdId}`)
        .orderBy('fechaPregunta', 'desc')
    );
  }

  getCourseQuestions(courseId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`chat/cursos/${courseId}`);
  }

  getQuestion(courseId: string, questionId: string): AngularFirestoreDocument {
    return this.fireStore.doc(`chat/cursos/${courseId}/${questionId}`);
  }

  getQuestionAnswers(
    courseId: string,
    questionId: string
  ): AngularFirestoreCollection {
    return this.fireStore.collection(
      `chat/cursos/${courseId}/${questionId}/respuestas`,
      (ref) => ref.orderBy('fechaRespuesta', 'desc')
    );
  }
}
