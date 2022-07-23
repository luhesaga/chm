import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<firebase.User>;

  params = {
    'auth/network-request-failed': 'Error en conexión de red.',
    'auth/too-many-requests': 'Limite de peticiones agotado, intente mas tarde.',
    'auth/email-already-in-use': 'Este email ya esta registrado en la plataforma.',
  };

  constructor(
    private af: AngularFireAuth,
    private firestore: AngularFirestore,
    private route: Router,
    private ngZone: NgZone,
    private userService: UsersService
  ) {
    // recuperar datos de usuario para el guard y el nav
    this.user$ = this.af.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.doc(`usuarios/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );

  }

  getDate(): Observable<firebase.User> {
    return this.af.authState;
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.af.signInWithEmailAndPassword(email, password)
      .then((result) => {
        // console.log(result);
        if (result.user.emailVerified !== true) {
          result.user.sendEmailVerification();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Debe verificar su cuenta!',
            confirmButtonText: 'cerrar',
          });
          this.logout();
        } else {
          Swal.fire({
            html: '<h1 style="color: white;">Estamos preparando todo para ti</h1>',
            background: 'rgba(0,0,0,.5)',
            showConfirmButton: false,
            backdrop: true,
            timer: 1000,
            timerProgressBar: false,
            onBeforeOpen: () => {
              Swal.showLoading();
            }
          }).then(() => {
            this.ngZone.run(() => {
              this.route.navigate(['dashboard']);
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡usuario o contraseña invalidos!',
          confirmButtonText: 'cerrar',
        });
      });
  }

  registerUser(email: string, password: string, data: any): Promise<any> {
    return this.af.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified !== true) {
          data.fechaCreacion = result.user.metadata.creationTime;
          result.user.sendEmailVerification();
          this.userService.createUser(data, result.user.uid)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Usuario agregado exitosamente, debe verificar su cuenta dando click en el enlace que enviamos a su correo.',
                confirmButtonText: 'cerrar',
              });
              this.route.navigate(['home/login']);
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'Ocurrio un error' + error,
                confirmButtonText: 'cerrar',
              });
            });
        }
      })
      .catch((error) => {
        const message = this.printErrorByCode(error.code);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          backdrop: false,
          confirmButtonColor: '#eb445a',
          confirmButtonText: 'cerrar',
        });
      });
  }

  logout(): void {
    localStorage.removeItem('correoCursos');
    localStorage.removeItem('carreraCurso');
    this.af.signOut();
  }

  facebookLogin() {
    return this.af.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(r => console.log(r));
  }

  googleLogin() {
    return this.af.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(r => console.log(r));
  }

  resetPassword(email: string) {
    return this.af.sendPasswordResetEmail(email);
  }

  async passwordValid(oldPass) {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPass
    );
    await user.reauthenticateWithCredential(credential);
    /**/
  }

  passwordChange(newPassword) {
    const user = firebase.auth().currentUser;
    return user.updatePassword(newPassword);
  }

  printErrorByCode(code: string): string {
    if (this.params[code]) {
      return (this.params[code]);
    } else {
      return ('Ocurrió un error inesperado. \n Codigo de error: ' + code);
    }
  }

}
