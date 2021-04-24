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
export class LessonsService {

  constructor(public fireStore: AngularFirestore) { }

  listLessons(id): AngularFirestoreCollection {
    return this.fireStore.collection(`cursos/${id}/lecciones`, ref =>
      ref.orderBy('posicion', 'asc'));
  }

  lessonDetail(courseId: string, lessonId: string) {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}`);
  }

  createLesson(data): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`cursos/${data.id}/lecciones/${id}`)
      .set({
          id,
          nombre: data.name,
          posicion: data.position
        });
  }

  editLessonPosition(courseId: string, lessonId: string, pos: number): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}`)
      .update({
        posicion: pos,
      });
  }

  editLessonName(courseId: string, lessonId: string, name: string): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}`)
      .update({
        nombre: name,
      });
  }

  addLessonContent(data, courseId, lessonId) {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${id}`)
      .set({
          id,
          titulo: data.titulo,
          contenido: data.contenido
        });
  }

  listLessonContent(courseId, lessonId): AngularFirestoreCollection {
    console.log(`curso: ${courseId}, leccion: ${lessonId}`);
    return this.fireStore.collection(`cursos/${courseId}/lecciones/${lessonId}/contenido`, ref =>
      ref.orderBy('posicion', 'asc'));
  }

  editLessonContentPosition(courseId: string, lessonId: string, contentId: string, pos: number): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}`)
      .update({
        posicion: pos,
      });
  }
}
