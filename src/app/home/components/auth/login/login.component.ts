import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // validacion de errores firebase auth
  params = {
    'auth/network-request-failed': 'Error en conexión de red.',
    'auth/too-many-requests':
      'Limite de peticiones agotado, intente mas tarde.',
    'auth/email-already-in-use':
      'Este email ya esta registrado en la plataforma.',
  };

  // validaciones formulario
  loginForm: FormGroup;
  validationMessages = {
    mail: [
      { type: 'required', message: 'Campo requerido' },
      { type: 'email', message: 'Correo invalido' },
    ],
    password: [
      { type: 'required', message: 'Campo requerido' },
      { type: 'minlength', message: 'minimo 6 caracteres' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userServ: UsersService,
    private route: Router
  ) {
    this.loginForm = this.formBuilder.group({
      mail: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }

  ngOnInit(): void {}

  loginUser(data): void {
    const email = data.mail;
    const pass = data.password;
    const validar = this.userServ
      .usuarioPorCorreo(email)
      .valueChanges()
      .subscribe((usuario: any) => {
        if (usuario.length > 0) {
          if (usuario[0].eliminado) {
            Swal.fire(
              'Error',
              'Su cuenta se encuentra inhabilitada. Contacte con comercial@chym-ndt.com para validar',
              'error'
            );
          } else {
            this.allowLogin(email, pass);
          }
        } else {
          this.allowLogin(email, pass);
        }
        validar.unsubscribe();
      });
  }

  allowLogin(email, pass): void {
    this.auth.loginUser(email, pass).then(() => {
      const getDate = this.auth.getDate().subscribe((u) => {
        const user = this.auth.user$.subscribe((us: any) => {
          if (!us.fechaCreacion) {
            this.userServ.updateCreateDate(us.id, u.metadata.creationTime);
          }
          localStorage.setItem('correoCursos', 'no');
          localStorage.setItem('carreraCurso', 'no');
          user.unsubscribe();
        });
        getDate.unsubscribe();
      });
    });
  }

  printErrorByCode(code: string): string {
    if (this.params[code]) {
      return this.params[code];
    } else {
      return 'Ocurrió un error inesperado. \n Codigo de error: ' + code;
    }
  }

  loginGoogle(): void {
    this.auth.googleLogin();
  }

  loginFacebook(): void {
    this.auth.facebookLogin();
  }
}
