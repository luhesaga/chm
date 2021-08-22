import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-carreras',
  templateUrl: './create-carreras.component.html',
  styleUrls: ['./create-carreras.component.scss']
})
export class CreateCarrerasComponent implements OnInit {

  formCarreras: FormGroup;
  showImage:any;

  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private carrerasService: CarrerasService,
    private router: Router
  ) {
    this.buildForm();
    this.showImage={src:''};
  }

  ngOnInit(): void {
  }

  private buildForm(): void {
    this.formCarreras = this.formBuilder.group({
      nombre: ['', Validators.required,],
      image: ['', Validators.required]
    })
  }

  obtenerImagen(event:any)
  {
    if(event.target.value)
    {
      this.showImage = event.target.files[0];
      this.formCarreras.get('image').setValue(this.showImage);
      this.imageURL();
    }
  }

  imageURL():void
  {
    const reader = new FileReader();
    reader.onload = (event) =>
    {
      this.showImage.src = event.target.result;
    }
    reader.readAsDataURL(this.showImage);
  }

  validarFormulario()
  {
    if(this.formCarreras.invalid)
    {
      this.mensajeFormularioInvalido()
    }
    else
    {
      this.subiendoDatos();
      this.uploadNewImage();
    }
  }

  subiendoDatos()
  {
    Swal.fire({
      title: 'Creando la carrera, un momento por favor',
      confirmButtonColor:'#007279',
      didOpen:()=>{
        Swal.showLoading();
      }
    });
  }

  mensajeFormularioInvalido()
  {
    Swal.fire({
      icon:'info',
      title: 'Campos invalidos',
      text:'El campo nombre de carrera y la imagen son requeridas',
      confirmButtonText:'Aceptar'
    });
  }

  uploadNewImage()
  {
    const id = this.fireStore.createId();
    const nameImage = this.imageField.value.name;
    const fileRef = this.fireStorage.ref(`carreras/${id}/${nameImage}`);
    this.fireStorage.upload(`carreras/${id}/${nameImage}`,this.imageField.value)
    .then(()=>{
      const unsubscribeFile =fileRef.getDownloadURL()
      .subscribe(url =>
        {
        this.imageField.setValue(url);
        this.createCarreras(id);
        unsubscribeFile.unsubscribe();
      }, ()=> this.mensajeDeError());
    }, ()=> this.mensajeDeError());
  }

  createCarreras(id:string)
  {
    this.carrerasService.crearCarreras(this.formCarreras.value, id)
    .then(()=> this.mensajeExito(),
    ()=> this.mensajeDeError());
  }

  get imageField()
  {
    return this.formCarreras.get('image');
  }

  mensajeDeError()
  {
    Swal.fire({
      icon: 'error',
      title:'No se pudo crear la carrera, por favor intente otra vez',
      confirmButtonText: 'Cerrar'
    })
  }

  mensajeExito()
  {
    Swal.fire({
      icon: 'success',
      title:'Carrera creada exitosamente',
      confirmButtonText: 'Aceptar'
    }).then(()=> this.volverAListaCarreras())
  }

  volverAListaCarreras()
  {
    this.router.navigate(['dashboard/carreras']);
  }

}
