import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(public fireStore: AngularFirestore) { }

  listExercises(courseId): AngularFirestoreCollection {
    return this.fireStore.collection(`ejercicios/${courseId}/ejercicios`, ref =>
    ref.orderBy('fecha', 'desc'));
  }

  exerciseDetail(courseId: string, exercId: string) {
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${exercId}`);
  }

  createExercise(data, courseId): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${id}`)
      .set({
          id,
          nombre: data.name,
          fecha: data.fecha,
          duracion: data.duration,
          retroalimentacion: data.feedback * 1,
          intentos: data.maxTries * 1,
          barajar: data.mixAnswers * 1,
          porcentaje: data.percentage,
          seleccion: data.questionSelect * 1,
          mostrarResultados: data.showResults * 1,
          textoFinal: data.textEnd ? data.textEnd : '',
        });
  }

  editExercise(data, courseId: string, exercId: string): Promise<void> {
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${exercId}`)
      .update({
        nombre: data.name,
        fecha: data.fecha,
        duracion: data.duration,
        retroalimentacion: data.feedback * 1,
        intentos: data.maxTries * 1,
        barajar: data.mixAnswers * 1,
        porcentaje: data.percentage,
        seleccion: data.questionSelect * 1,
        mostrarResultados: data.showResults * 1,
        textoFinal: data.textEnd ? data.textEnd : '',
      });
  }

  deleteExercise(courseId: string, exercId: string): Promise<void> {
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${exercId}`).delete();
  }

  addQuestion(courseId: string, exercId: string, question): Promise<void> {
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${exercId}`)
      .update({
        preguntas: question,
      });
  }
}
