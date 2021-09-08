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
export class CarrerasService {

  constructor(public fireStore: AngularFirestore) { }

  crearCarreras(data:any, id:string):Promise <void>
  {
    return this.fireStore.doc(`carreras/${id}`).set({
      nombre: data.nombre,
      image: data.image,
      id,
      descripcion:'',
      introduccion:'',
      objetivo:'',
      contenido:'',
      duracion:'',
      requisitosPrevios:'',
      dirigido:'',
      evaluacion:'',
      requisitosCalificacion:''
    });
  }

  obtenerCarreras():AngularFirestoreCollection
  {
    return this.fireStore.collection('carreras');
  }

  obtenerCarrera(id:string):AngularFirestoreDocument <void>
  {
    return this.fireStore.doc(`carreras/${id}`);
  }

  actualizarCarreras(data:any, id:string):Promise <void>
  {
    return this.fireStore.doc(`carreras/${id}`).update({
      nombre: data.nombre,
      image: data.image,
    });
  }

  actualizarDescripcionCarrera(data:any, id:string):Promise <void>
  {
    return this.fireStore.doc(`carreras/${id}`).update({
      descripcion:data.descripcion,
      introduccion:data.introduccion,
      objetivo:data.objetivo,
      contenido:data.contenido,
      duracion:data.duracion,
      requisitosPrevios:data.requisitosPrevios,
      dirigido:data.dirigido,
      evaluacion:data.evaluacion,
      requisitosCalificacion:data.requisitosCalificacion
    });
  }

  matriculadosObtener(id:string)
  {
    return this.fireStore.collection(`carreras/${id}/matriculados`);
  }

  matricularUsuario(data:any, idCarreras: string)
  {
    return this.fireStore.doc(`carreras/${idCarreras}/matriculados/${data.id}`).set({
      id:data.id,
      matriculaIndividual:data.matriculaIndividual,
      nombre: `${data.nombres} ${data.apellidos}`,
      fechaMatricula: data.fechaMatricula,
      fechaFinalizacionMatricula: data.fechaFinalizacionMatricula,
      tipoMatricula:data.tipoMatricula
    });
  }

  actualizarMatriculaIndividual(data:any, idCarreras: string)
  {
    return this.fireStore.doc(`carreras/${idCarreras}/matriculados/${data.id}`).update({
      matriculaIndividual:data.matriculaIndividual,
    });
  }

  desmatricularUsuario(id:string, idCarreras: string)
  {
    return this.fireStore.doc(`carreras/${idCarreras}/matriculados/${id}`).delete();
  }

  cursosAgregadosObtener(id:string)
  {
    return this.fireStore.collection(`carreras/${id}/cursos`);
  }

  agregarCurso(id:string, idCarreras: string, nombre:string)
  {
    return this.fireStore.doc(`carreras/${idCarreras}/cursos/${id}`).set({
      id,
      nombre
    });
  }

  quitarCurso(id:string, idCarreras: string)
  {
    return this.fireStore.doc(`carreras/${idCarreras}/cursos/${id}`).delete();
  }
}


