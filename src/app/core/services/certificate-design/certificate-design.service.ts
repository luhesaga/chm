import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CertificateDesignService {

  constructor(public fireStore: AngularFirestore) { }

  createCertificate(data): Promise<void> {
    const id = this.fireStore.createId();
    return this.fireStore.doc(`cert-designs/${id}`).set({
      id,
      contenido: data.contenido,
      titulo: data.titulo
    });
  }

  editCertDesign(data: any): Promise<void> {
    return this.fireStore.doc(`cert-designs/${data.id}`)
      .update(
        {
          contenido: data.contenido,
          titulo: data.titulo
        }
      );
  }

  getUniqueDesign(id: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cert-designs`, (ref) =>
      ref.where('id', '==', id)
    );
  }

  listCertsDesigns(): AngularFirestoreCollection {
    return this.fireStore.collection(`cert-designs`, (ref) =>
      ref.orderBy('titulo', 'asc')
    );
  }

  getDesign(id: string): AngularFirestoreDocument {
    return this.fireStore.doc(`cert-designs/${id}`);
  }

  deleteCertDesign(id: string): Promise<void> {
    return this.fireStore.doc(`cert-designs/${id}`)
      .delete();
  }
}
