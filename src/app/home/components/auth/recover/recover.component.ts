import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  recoverForm: FormGroup;

  validationMessages = {
    email: [
      { type: 'required', message: ' El email es requerido' },
      { type: 'email', message: 'Este no es un email válido' }
    ]
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.recoverForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
    });
  }

  ngOnInit(): void {
  }

  resetPassword(formValue) {
    const email = formValue.email;
    this.authService.resetPassword(email)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Correcto!',
        text: 'Hemos enviado un correo de recuperación a la direccion ingresada.',
        backdrop: false,
        confirmButtonColor: '#007279',
        confirmButtonText: 'Aceptar',
      });
      this.recoverForm.get('email').setValue('');
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡El email ingresado no esta registrado en la plataforma!',
        backdrop: false,
        confirmButtonColor: '#eb445a',
        confirmButtonText: 'Cerrar',
      });
    });
  }

}
