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
        });
  }

  editExercise(data, courseId: string, exercId: string): Promise<void> {
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${exercId}`)
      .update({
        nombre: data.name,
        fecha: data.fecha,
      });
  }

  addQuestion(courseId: string, exercId: string, question): Promise<void> {
    return this.fireStore.doc(`ejercicios/${courseId}/ejercicios/${exercId}`)
      .update({
        preguntas: question,
      });
  }
}
