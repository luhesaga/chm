import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { Router } from '@angular/router';
import { CertificateDesignService } from '../../../../core/services/certificate-design/certificate-design.service';

@Component({
  selector: 'app-create-carreras',
  templateUrl: './create-carreras.component.html',
  styleUrls: ['./create-carreras.component.scss'],
})
export class CreateCarrerasComponent implements OnInit {
  formCarreras: FormGroup;
  showImage: any;
  certs: any;
  vence = false;
  visible = false;

  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private carrerasService: CarrerasService,
    private router: Router,
    private cert: CertificateDesignService
  ) {
    this.buildForm();
    this.showImage = { src: '' };
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
      plantilla: ['', Validators.required],
      vencimiento: [0],
      vence: [false, Validators.required],
      cop: [0, Validators.required],
      usd: [0, Validators.required],
      visible: [false, Validators.required],
    });
  }

  obtenerImagen(event: any): void {
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

  validarFormulario(): void {
    if (this.formCarreras.invalid) {
      this.mensajeFormularioInvalido();
    } else {
      this.subiendoDatos();
      this.uploadNewImage();
    }
  }

  subiendoDatos(): void {
    Swal.fire({
      title: 'Creando la carrera, un momento por favor',
      confirmButtonColor: '#007279',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  mensajeFormularioInvalido(): void {
    Swal.fire({
      icon: 'info',
      title: 'Campos invalidos',
      text: 'El campo nombre de carrera y la imagen son requeridas',
      confirmButtonText: 'Aceptar',
    });
  }

  uploadNewImage(): void {
    const id = this.fireStore.createId();
    const nameImage = this.imageField.value.name;
    const fileRef = this.fireStorage.ref(`carreras/${id}/${nameImage}`);
    this.fireStorage
      .upload(`carreras/${id}/${nameImage}`, this.imageField.value)
      .then(
        () => {
          const unsubscribeFile = fileRef.getDownloadURL().subscribe(
            (url) => {
              this.imageField.setValue(url);
              this.createCarreras(id);
              unsubscribeFile.unsubscribe();
            },
            () => this.mensajeDeError()
          );
        },
        () => this.mensajeDeError()
      );
  }

  createCarreras(id: string): void {
    this.carrerasService.crearCarreras(this.formCarreras.value, id).then(
      () => this.mensajeExito(),
      () => this.mensajeDeError()
    );
  }

  get imageField(): AbstractControl {
    return this.formCarreras.get('image');
  }

  get nombreField(): AbstractControl {
    return this.formCarreras.get('nombre');
  }

  get siglaField(): AbstractControl {
    return this.formCarreras.get('sigla');
  }

  get duracionCarreraField(): AbstractControl {
    return this.formCarreras.get('duracionCarrera');
  }

  get plantillaField(): AbstractControl {
    return this.formCarreras.get('plantilla');
  }

  get vencimientoField(): AbstractControl {
    return this.formCarreras.get('vencimiento');
  }

  get venceField(): AbstractControl {
    return this.formCarreras.get('vence');
  }

  get copField(): AbstractControl {
    return this.formCarreras.get('cop');
  }

  get usdField(): AbstractControl {
    return this.formCarreras.get('usd');
  }

  get visibleField(): AbstractControl {
    return this.formCarreras.get('visible');
  }

  mensajeDeError(): void {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo crear la carrera, por favor intente otra vez',
      confirmButtonText: 'Cerrar',
    });
  }

  mensajeExito(): void {
    Swal.fire({
      icon: 'success',
      title: 'Carrera creada exitosamente',
      confirmButtonText: 'Aceptar',
    }).then(() => this.volverAListaCarreras());
  }

  volverAListaCarreras(): void {
    this.router.navigate(['dashboard/carreras']);
  }
}
