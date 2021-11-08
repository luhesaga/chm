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

  detailUser(userId: string) {
    return this.fireStore.doc(`usuarios/${userId}`);
  }

  updateUserInfo(data, userId) {
    return this.fireStore.doc(`usuarios/${userId}`)
      .update(
        {
          nombres: data.nombres ? data.nombres : '',
          apellidos: data.apellidos ? data.apellidos : '',
          correo: data.correo ? data.correo : '',
          tipoId: data.tipoId ? data.tipoId : '',
          identificacion: data.identificacion ? data.identificacion : '',
          departamento: data.departamento ? data.departamento : '',
          ciudad: data.ciudad ? data.ciudad : '',
          direccion: data.direccion ? data.direccion : '',
          codigoPais: data.codigoPais ? data.codigoPais : '',
          telefono: data.telefono ? data.telefono : '',
        }
      )
  }

  updateCreateDate(userId, fecha) {
    return this.fireStore.doc(`usuarios/${userId}`)
      .update(
        {
          fechaCreacion: fecha,
        }
      )
  }

  listTeachers(): AngularFirestoreCollection {
    return this.fireStore.collection('usuarios', ref =>
      ref.where('perfil', '==', 'profesor'));
  }

  listStudents(): AngularFirestoreCollection {
    return this.fireStore.collection('usuarios', ref =>
      ref.where('perfil', '==', 'estudiante').orderBy('nombres', 'asc'));
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
          perfil: data.perfil,
          admin
      });
  }

  obtenerElEstadoMatriculaEstudiante(idUsuario:string, idCurso:string)
  {
    return this.fireStore.doc(`usuarios/${idUsuario}/miscursos/${idCurso}`);
  }

  verificarMatriculaDelEstudiante(idUsuario:string, idCurso:string, contenidoCurso: any):void
  {
    let subscribe = this.fireStore.doc(`usuarios/${idUsuario}/miscursos/${idCurso}`)
    .valueChanges()
    .subscribe((cursos:any) =>
      {
        if(cursos)
        {
          this.cambiarEstadoDeLaMatricula(idUsuario, idCurso, !cursos.matriculado)
        }
        else
        {
          this.matricularEstudiante(idUsuario, idCurso, contenidoCurso);
        }
        subscribe.unsubscribe();
      });
  }

  matricularEstudiante(idUsuario:string, idCurso:string, contenidoCurso: any)
  {
    this.fireStore.doc(`usuarios/${idUsuario}/miscursos/${idCurso}`)
    .set({
      idUsuario,
      idCurso,
      lecciones: contenidoCurso.lessons,
      contenidoLecciones: contenidoCurso.content,
      matriculado: true
    });
  }

  cambiarEstadoDeLaMatricula(idUsuario:string, idCurso:string, estadoMatricula: boolean)
  {
    this.fireStore.doc(`usuarios/${idUsuario}/miscursos/${idCurso}`)
    .update({
      matriculado: estadoMatricula
    });
  }

  getUserCourseLessons(userId, courseId): AngularFirestoreDocument {
    return this.fireStore.doc(`usuarios/${userId}/miscursos/${courseId}`);
  }

  agregarAnuncios(data, idEstudiante:string, idAnuncios): Promise<void> {
    return this.fireStore.doc(`usuarios/${idEstudiante}/anuncios/${idAnuncios}`)
      .set({
        titulo:data.titulo,
        id:data.idAnuncios,
        visto:false
      });
  }

  eliminarAnuncioEstudiante(idUsuario:string, idAnuncio:string)
  {
    return this.fireStore.doc(`usuarios/${idUsuario}/anuncios/${idAnuncio}`).delete();
  }

  editarAnuncios(data, idEstudiante:string, idAnuncios): Promise<void> {
    return this.fireStore.doc(`usuarios/${idEstudiante}/anuncios/${idAnuncios}`)
      .update({
        titulo:data.titulo,
        visto:false
      });
  }

  obtenerAnuncioEstudiante(idUsuario:string, idAnuncio:string)
  {
    return this.fireStore.doc(`usuarios/${idUsuario}/anuncios/${idAnuncio}`);
  }

}
