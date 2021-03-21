import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(public fireStore: AngularFirestore) { }

  listCategories(): AngularFirestoreCollection {
    return this.fireStore.collection(`categorias`, ref =>
      ref.orderBy('nombre', 'asc'));
  }

  detailCategory(id): AngularFirestoreDocument {
    return this.fireStore.doc(`categorias/${id}`);
  }

  createCategory(data): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`categorias/${id}`)
      .set({
          id,
          nombre: data.name,
        });
  }
}
