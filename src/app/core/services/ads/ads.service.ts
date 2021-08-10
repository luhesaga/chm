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

  createAds(data, id, imgName): Promise<void>
  {
    return this.fireStore.doc(`ads/${id}`)
      .set(
        {
          id,
          nombre: data.name,
          imagen: data.image,
          nombreImg: imgName,
          descripcion: data.description,
          fechaYHora: data.fechaYHora,
          fechaCaducidad: data.fechaCaducidad
        });
  }

  listAds(): AngularFirestoreCollection
  {
      return this.fireStore.collection(`ads`, ref =>
        ref.orderBy('fechaYHora', 'desc'));
  }


  obtainAds(id): AngularFirestoreDocument<any> {
    return this.fireStore.doc(`ads/${id}`);
  }

  editAds(data, id, fechaYHora): Promise<void> {
    return this.fireStore.doc(`ads/${id}`)
      .update({
        descripcion: data.description,
        fechaYHora,
        nombreImg: data.imageName,
        imagen: data.image,
        nombre: data.name,
        fechaCaducidad:data.fechaCaducidad
      });
  }

  editAdsWithOutTime(data, id): Promise<void> {
    return this.fireStore.doc(`ads/${id}`)
      .update({
        descripcion: data.description,
        nombreImg: data.imageName,
        imagen: data.image,
        nombre: data.name,
        fechaCaducidad:data.fechaCaducidad
      });
  }

  deleteAds(id:string):Promise<void>
  {
    return this.fireStore.collection('ads').doc(id).delete();
  }
}
