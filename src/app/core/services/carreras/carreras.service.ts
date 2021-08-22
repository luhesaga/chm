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
      id
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
}


