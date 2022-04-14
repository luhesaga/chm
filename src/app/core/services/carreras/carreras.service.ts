import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CarrerasService {
  constructor(public fireStore: AngularFirestore) {}

  crearCarreras(data: any, id: string): Promise<void> {
    return this.fireStore.doc(`carreras/${id}`).set({
      nombre: data.nombre,
      image: data.image,
      id,
      descripcion: '',
      introduccion: '',
      objetivo: '',
      contenido: '',
      duracion: '',
      requisitosPrevios: '',
      dirigido: '',
      evaluacion: '',
      requisitosCalificacion: '',
      calificacionEstrellas: [],
      siglaCarrera: data.sigla,
      duracionCarrera: data.duracionCarrera,
      plantilla: data.plantilla,
      vence: data.vence,
      vencimiento: data.vencimiento
    });
  }

  obtenerCarreras(): AngularFirestoreCollection {
    return this.fireStore.collection('carreras');
  }

  obtenerCarrera(id: string): AngularFirestoreDocument {
    return this.fireStore.doc(`carreras/${id}`);
  }

  actualizarCarreras(data: any, id: string): Promise<void> {
    return this.fireStore.doc(`carreras/${id}`).update({
      nombre: data.nombre,
      image: data.image,
      siglaCarrera: data.sigla,
      duracionCarrera: data.duracionCarrera,
      plantilla: data.plantilla,
      vence: data.vence,
      vencimiento: data.vencimiento
    });
  }

  actualizarDescripcionCarrera(data: any, id: string): Promise<void> {
    return this.fireStore.doc(`carreras/${id}`).update({
      descripcion: data.descripcion,
      introduccion: data.introduccion,
      objetivo: data.objetivo,
      contenido: data.contenido,
      duracion: data.duracion,
      requisitosPrevios: data.requisitosPrevios,
      dirigido: data.dirigido,
      evaluacion: data.evaluacion,
      requisitosCalificacion: data.requisitosCalificacion,
    });
  }

  matriculadosObtener(id: string): AngularFirestoreCollection {
    return this.fireStore.collection(`carreras/${id}/matriculados`);
  }

  getRegisteredUser(careerId: string, stdId: string): AngularFirestoreDocument {
    return this.fireStore.doc(`carreras/${careerId}/matriculados/${stdId}`);
  }

  matricularUsuario(data: any, idCarreras: string): Promise<void> {
    return this.fireStore
      .doc(`carreras/${idCarreras}/matriculados/${data.id}`)
      .set({
        id: data.id,
        matriculaIndividual: data.matriculaIndividual,
        nombre: `${data.nombres} ${data.apellidos}`,
        fechaMatricula: data.fechaMatricula,
        fechaFinalizacionMatricula: data.fechaFinalizacionMatricula,
        tipoMatricula: data.tipoMatricula,
      });
  }

  actualizarMatriculaIndividual(data: any, idCarreras: string): Promise<void> {
    return this.fireStore
      .doc(`carreras/${idCarreras}/matriculados/${data.id}`)
      .update({
        matriculaIndividual: data.matriculaIndividual,
      });
  }

  desmatricularUsuario(id: string, idCarreras: string): Promise<void> {
    return this.fireStore
      .doc(`carreras/${idCarreras}/matriculados/${id}`)
      .delete();
  }

  getCareerCourses(id: string): AngularFirestoreCollection {
    return this.fireStore.collection(`carreras/${id}/cursos`, (ref) =>
      ref.orderBy('posicion', 'asc')
    );
  }

  validateCareerCourse(id: string, courseId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`carreras/${id}/cursos`, (ref) =>
      ref.where('id', '==', courseId)
    );
  }

  getCareerCourseData(careerId: string, courseId: string): AngularFirestoreDocument {
    return this.fireStore.doc(`carreras/${careerId}/cursos/${courseId}`);
  }

  agregarCurso(data): Promise<void> {
    return this.fireStore
      .doc(`carreras/${data.idCarrera}/cursos/${data.id}`)
      .set({
        id: data.id,
        nombre: data.nombre,
        posicion: data.posicion,
      });
  }

  setCoursePosition(data): Promise<void> {
    return this.fireStore.doc(`carreras/${data.idCarrera}/cursos/${data.id}`)
    .update({
      posicion: data.posicion,
    });
  }

  quitarCurso(id: string, idCarreras: string): Promise<void> {
    return this.fireStore.doc(`carreras/${idCarreras}/cursos/${id}`).delete();
  }

  createExercise(data, careerId): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`carreras/${careerId}/cursos/${id}`)
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
          tipo: 'ejercicio',
          posicion: data.posicion,
          questionsNumber: data.questionsNumber * 1
        });
  }

  editExercise(data, careerId: string, exercId: string): Promise<void> {
    return this.fireStore.doc(`carreras/${careerId}/cursos/${exercId}`)
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
        questionsNumber: data.questionsNumber * 1
      });
  }

  exerciseDetail(careerId: string, exercId: string): AngularFirestoreDocument {
    return this.fireStore.doc(`carreras/${careerId}/cursos/${exercId}`);
  }

  deleteExercise(careerId: string, exercId: string): Promise<void> {
    return this.fireStore
      .doc(`carreras/${careerId}/cursos/${exercId}`)
      .delete();
  }

  addQuestion(careerId: string, exercId: string, question): Promise<void> {
    return this.fireStore
      .doc(`carreras/${careerId}/cursos/${exercId}`)
      .update({
        preguntas: question,
      });
  }

  agregarEstrella(calificacionEstrellas: any[], idCarreras: string): Promise<void> {
    return this.fireStore.doc(`carreras/${idCarreras}`).update({
      calificacionEstrellas,
    });
  }
}
