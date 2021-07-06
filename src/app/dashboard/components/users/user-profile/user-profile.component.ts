import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';
import countries from './cities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  form: FormGroup;

  idUser;
  userReceived;
  user;

  // form fields
  name;
  lastName;
  mail;
  idType;
  idNumber;
  state;
  city;
  address;
  countryId;
  phoneNumber;

  countriesList = countries;

  constructor(
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
  ) {
    this.idUser = this.activatedRoute.snapshot.params.idUser;
    this.buildForm();
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.userReceived.unsubscribe();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      nombres: ['', Validators.required,],
      apellidos: ['', Validators.required],
      correo: [''],
      tipoId: [''],
      identificacion: [''],
      departamento: [''],
      ciudad: [''],
      direccion: [''],
      codigoPais: [''],
      telefono: ['']
    })
  }

  get nombresField() {
    return this.form.get('nombres');
  }

  get apellidosField() {
    return this.form.get('apellidos');
  }

  get correoField() {
    return this.form.get('correo');
  }

  get tipoIdField() {
    return this.form.get('tipoId');
  }

  get identificacionField() {
    return this.form.get('identificacion');
  }

  get departamentoField() {
    return this.form.get('departamento');
  }

  get ciudadField() {
    return this.form.get('ciudad');
  }

  get direccionField() {
    return this.form.get('direccion');
  }

  get codigoPaisField() {
    return this.form.get('codigoPais');
  }

  get telefonoField() {
    return this.form.get('telefono');
  }

  goToHome() {
    this.route.navigate(['dashboard'])
  }

  getUserInfo() {
    this.userReceived = this.userService.detailUser(this.idUser)
      .valueChanges()
      .subscribe((u: any) => {
        if (u) {
          this.user = u;
          this.name = u.nombres;
          this.lastName = u.apellidos;
          this.mail = u.correo;
          this.idType = u.tipoId;
          this.idNumber = u.identificacion;
          this.state = u.departamento;
          this.city = u.ciudad;
          this.address = u.direccion;
          this.countryId = u.codigoPais;
          this.phoneNumber = u.telefono;
        }
      });
  }

  updateUserProfile(event: Event) {
    console.log('aja que paso?');
    event.preventDefault();
    const data = this.form.value;
    this.userService.updateUserInfo(data, this.idUser)
    .then(() => {
			Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'Datos actualizados exitosamente',
				confirmButtonText: 'cerrar',
			});
			this.route.navigate(['dashboard/course-registration']);
		})
		.catch((error) => {
			Swal.fire({
				icon: 'error',
				title: 'error',
				text: 'Ocurrió un error' + error,
				confirmButtonText: 'cerrar',
            });
		});
  }

}
