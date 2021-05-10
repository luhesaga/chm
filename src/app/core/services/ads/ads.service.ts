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
export class AdsService {

  constructor(public fireStore: AngularFirestore) { }

  createAds(data, id, imgName): Promise<void> {
    return this.fireStore.doc(`ads/${id}`)
      .set(
        {
          id,
          nombre: data.name,
          imagen: data.image,
          nombreImg: imgName,
          descripcion: data.description,
          fechaYHora: data.fechaYHora
        });
  }
}