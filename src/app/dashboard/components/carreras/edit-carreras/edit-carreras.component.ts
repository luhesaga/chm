import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import Swal from 'sweetalert2';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CertificateDesignService } from 'src/app/core/services/certificate-design/certificate-design.service';

@Component({
  selector: 'app-edit-carreras',
  templateUrl: './edit-carreras.component.html',
  styleUrls: ['./edit-carreras.component.scss'],
})
export class EditCarrerasComponent implements OnInit {
  formCarreras: FormGroup;
  showImage: any;
  idCarreras: string;
  certs: any;

  constructor(
    private fireStorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private carrerasService: CarrerasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cert: CertificateDesignService
  ) {
    this.idCarreras = this.activatedRoute.snapshot.params.idCarreras;
    this.showImage = { src: '' };
    this.buildForm();
    this.obtenerCarrera();
  }

  ngOnInit(): void {
    this.getCertsDesigns();
  }

  getCertsDesigns(): void {
    const certsList = this.cert.listCertsDesigns()
      .valueChanges()
      .subscribe(c => {
        c.unshift({
          titulo: 'default',
          id: 'default',
          contenido: 'default'
        });
        this.certs = c;
        certsList.unsubscribe();
      });
  }

  private buildForm(): void {
    this.formCarreras = this.formBuilder.group({
      nombre: ['', Validators.required],
      image: ['', Validators.required],
      sigla: ['', Validators.required],
      duracionCarrera: [0, Validators.required],
      plantilla: ['', Validators.required]
    });
  }

  obtenerCarrera() {
    const unsubscribeCarrera = this.carrerasService
      .obtenerCarrera(this.idCarreras)
      .valueChanges()
      .subscribe((carrera: any) => {
        this.nombreField.setValue(carrera.nombre);
        this.imageField.setValue(carrera.image);
        this.siglaField.setValue(carrera.siglaCarrera);
        this.duracionCarreraField.setValue(carrera.duracionCarrera);
        this.showImage.src = carrera.image;
        this.plantillaField.setValue(carrera.plantilla);
        console.log(this.plantillaField.value);
        unsubscribeCarrera.unsubscribe();
      });
  }

  volverAListaCarreras() {
    this.router.navigate(['dashboard/carreras']);
  }

  get nombreField() {
    return this.formCarreras.get('nombre');
  }

  get imageField() {
    return this.formCarreras.get('image');
  }

  get siglaField() {
    return this.formCarreras.get('sigla');
  }

  get duracionCarreraField() {
    return this.formCarreras.get('duracionCarrera');
  }

  get plantillaField(): AbstractControl {
    return this.formCarreras.get('plantilla');
  }

  obtenerImagen(event: any) {
    if (event.target.value) {
      this.showImage = event.target.files[0];
      this.formCarreras.get('image').setValue(this.showImage);
      this.imageURL();
    }
  }

  imageURL(): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.showImage.src = event.target.result;
    };
    reader.readAsDataURL(this.showImage);
  }

  validarFormulario() {
    if (this.formCarreras.invalid) {
      this.mensajeFormularioInvalido();
    } else {
      this.editandoDatos();
      if (typeof this.imageField.value === 'string') {
        this.actualiazarCarrera(this.idCarreras);
      } else {
        this.uploadNewImage();
      }
    }
  }

  uploadNewImage() {
    const nameImage = this.imageField.value.name;
    const fileRef = this.fireStorage.ref(
      `carreras/${this.idCarreras}/${nameImage}`
    );
    this.fireStorage
      .upload(`carreras/${this.idCarreras}/${nameImage}`, this.imageField.value)
      .then(
        () => {
          const unsubscribeFile = fileRef.getDownloadURL().subscribe(
            (url) => {
              this.imageField.setValue(url);
              this.actualiazarCarrera(this.idCarreras);
              unsubscribeFile.unsubscribe();
            },
            () => this.mensajeDeError()
          );
        },
        () => this.mensajeDeError()
      );
  }

  actualiazarCarrera(id: string) {
    this.carrerasService.actualizarCarreras(this.formCarreras.value, id).then(
      () => this.mensajeExito(),
      () => this.mensajeDeError()
    );
  }

  mensajeFormularioInvalido() {
    Swal.fire({
      icon: 'info',
      title: 'Campos invalidos',
      text: 'El campo nombre de carrera y la imagen son requeridas',
      confirmButtonText: 'Aceptar',
    });
  }

  editandoDatos() {
    Swal.fire({
      title: 'Editando la carrera, un momento por favor',
      confirmButtonColor: '#007279',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  mensajeDeError() {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo editar la carrera, por favor intente otra vez',
      confirmButtonText: 'Cerrar',
    });
  }

  mensajeExito() {
    Swal.fire({
      icon: 'success',
      title: 'Carrera editada exitosamente',
      confirmButtonText: 'Aceptar',
    }).then(() => this.volverAListaCarreras());
  }
}
