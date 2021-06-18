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

  deleteLesson(courseId, id) {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${id}`).delete();
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

  addLessonContent(data, courseId, lessonId, filename, id) {
    //const id = this.fireStore.createId();
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${id}`)
      .set({
          id,
          titulo: data.titulo,
          tipo: data.tipo,
          contenido: data.contenido,
          archivo: data.archivo,
          nombreArchivo: filename,
          foro: data.foro,
          posicion: data.posicion,
          ejercicio: data.ejercicio,
        });
  }

  editLessonContent(data, courseId: string, lessonId: string, contentId: string, filename): Promise<void> {
    //console.log(data);
    //console.log(filename);
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}`)
      .update({
        titulo: data.titulo,
        tipo: data.tipo,
        contenido: data.contenido,
        archivo: data.archivo,
        nombreArchivo: filename,
        foro: data.foro,
        ejercicio: data.ejercicio,
      });
  }

  deleteLessonContent(courseId: string, lessonId: string, id: string) {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${id}`).delete();
  }

  lessonContentDetail(courseId, lessonId, contentId) {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}`);
  }

  listLessonContent(courseId, lessonId): AngularFirestoreCollection {
    //console.log(`curso: ${courseId}, leccion: ${lessonId}`);
    return this.fireStore.collection(`cursos/${courseId}/lecciones/${lessonId}/contenido`, ref =>
      ref.orderBy('posicion', 'asc'));
  }

  editLessonContentPosition(courseId: string, lessonId: string, contentId: string, pos: number): Promise<void> {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}`)
      .update({
        posicion: pos,
      });
  }

  pushForo(respuesta:any, courseId, lessonId, contentId)
  {
    let idRespuesta= this.fireStore.createId();
    this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/foro/${idRespuesta}`)
    .set({
      tiempo:respuesta.tiempo,
      tipo: respuesta.tipo,
      contenido: respuesta.contenido,
      nombreCompleto: respuesta.nombreCompleto,
      usuarioId: respuesta.id,
      id: idRespuesta
    });
  }

  listReplyForo(courseId, lessonId, contentId): AngularFirestoreCollection
  {
    return this.fireStore.collection(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/foro`, ref =>
    ref.orderBy('tiempo', 'desc'));
  }

  getReplyForo(courseId, lessonId, contentId, replayId)
  {
    return this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/foro/${replayId}`);
  }

  pushComentario(data,courseId, lessonId, contentId, replayId)
  {
    let reply:any;
    const subReplyForo = this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/foro/${replayId}`)
    .valueChanges()
    .subscribe(
      replyForo => {
        reply = replyForo;
        if(!reply.comentario)
        {
          this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/foro/${replayId}`)
          .update({comentario:[data]})
        }
        else
        {
          reply.comentario.push(data);
          this.fireStore.doc(`cursos/${courseId}/lecciones/${lessonId}/contenido/${contentId}/foro/${replayId}`)
          .update({comentario:reply.comentario})
        }
        subReplyForo.unsubscribe();
      }
    );
  }




}

