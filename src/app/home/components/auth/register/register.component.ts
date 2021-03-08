import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UsersService } from '../../../../core/services/users/users.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  pass;
  confPass;
  // validacion de errores firebase auth
  params = {
    'auth/network-request-failed': 'Error en conexión de red.',
    'auth/too-many-requests': 'Limite de peticiones agotado, intente mas tarde.',
    'auth/email-already-in-use': 'Este email ya esta registrado en la plataforma.',
  };

  // validaciones formulario
  userForm: FormGroup;
  validationMessages = {
    nombres: [
      { type: 'required', message: 'Campo requerido' },
    ],
    apellidos: [
      { type: 'required', message: 'Campo requerido' },
    ],
    password: [
      { type: 'required', message: 'Campo requerido' },
      { type: 'minlength', message: 'minimo 6 caracteres' },
    ],
    confirmation: [
      { type: 'required', message: 'Campo requerido' },
      { type: 'minlength', message: 'minimo 6 caracteres' },
    ],
    mail: [
      { type: 'required', message: 'Campo requerido' },
      { type: 'email', message: 'Correo invalido' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private auth: AuthService,
    private route: Router
  ) {
    this.userForm = this.formBuilder.group({
      nombres: new FormControl('', Validators.compose([
        Validators.required
      ])
      ),
      apellidos: new FormControl('', Validators.compose([
        Validators.required,
      ])
      ),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])
      ),
      confirmation: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])
      ),
      mail: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])
      ),
    });
  }

  ngOnInit(): void {
  }

  saveUser(data): void {

    this.auth.registerUser(data.mail, data.password)
      .then((res) => {
        this.userService.createUser(data, res.user.uid)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Exito!',
              text: 'Usuario agregado exitosamente',
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

  printErrorByCode(code: string): string {
    if (this.params[code]) {
        return (this.params[code]);
    } else {
        return ('Ocurrió un error inesperado. \n Codigo de error: ' + code);
    }
  }

}
