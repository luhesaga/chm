import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  form: FormGroup;
  user;

  constructor(
    public dialog: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private route: Router
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.user = {
      id: this.data.content.id,
      nombres: this.data.content.nombres,
      apellidos: this.data.content.apellidos,
      correo: this.data.content.correo,
      perfil: this.data.content.perfil
    };
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      nombres: ['', Validators.required,],
      apellidos: ['', Validators.required],
      //correo: ['', [Validators.required, Validators.email]],
      perfil: ['', Validators.required],
    });
  }

  get nombresField() {
    return this.form.get('nombres');
  }

  get apellidosField() {
    return this.form.get('apellidos');
  }

  // get correoField() {
  //   return this.form.get('correo');
  // }

  get perfilField() {
    return this.form.get('perfil');
  }

  updateUser(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
    }
    const data = this.form.value;
    this.userService.editUser(data, this.user.id)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Usuario editado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.route.navigate(['dashboard/usuarios']);
        this.dialog.close();
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

}
