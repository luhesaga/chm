import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-carreras',
  templateUrl: './create-carreras.component.html',
  styleUrls: ['./create-carreras.component.scss']
})
export class CreateCarrerasComponent implements OnInit {

  formCarreras: FormGroup;
  showImage:any;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
    this.showImage={src:''};
  }

  ngOnInit(): void {
  }

  private buildForm(): void {
    this.formCarreras = this.formBuilder.group({
      titulo: ['', Validators.required,],
      image: ['', Validators.required]
    })
  }

  otenerImagen(event:any)
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
      console.log('exito');
    }
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

}
