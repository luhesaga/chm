import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection, AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public fireStore: AngularFirestore) { }

  listUsers(): AngularFirestoreCollection {
    return this.fireStore.collection(`usuarios`);
  }

  createUser(data, id): Promise<void> {
    data.password = btoa(data.password);
    return this.fireStore.doc(`usuarios/${id}`)
      .set({
          id,
          nombres: data.nombres,
          apellidos: data.apellidos,
          password: data.password,
          correo: data.mail,
          perfil: 'estudiante'
      });
  }

  becomeAdmin(id, admin) {
    return this.fireStore.doc(`usuarios/${id}`)
      .update({
        admin,
        perfil: 'administrador'
      });
  }

  editUser(data, id): Promise<void> {
    data.password = btoa(data.password);
    let admin = false;
    if (data.perfil === 'administrador') {
      admin = true;
    }
    return this.fireStore.doc(`usuarios/${id}`)
      .update({
          nombres: data.nombres,
          apellidos: data.apellidos,
          correo: data.correo,
          perfil: data.perfil,
          admin
      });
  }
}
