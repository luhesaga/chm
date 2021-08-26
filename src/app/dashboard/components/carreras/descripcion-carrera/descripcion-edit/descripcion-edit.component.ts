import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { AsyncSubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-descripcion-edit',
  templateUrl: './descripcion-edit.component.html',
  styleUrls: ['./descripcion-edit.component.scss']
})
export class DescripcionEditComponent implements OnInit  {

  carrera:any;

  contenido:string;

  private editorSubject: Subject<any> = new AsyncSubject();

  constructor(
    public dialog: MatDialogRef<DescripcionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private carrerasService: CarrerasService
  ) { 
    this.carrera={};
  }

  ngOnInit(): void {
    this.obtenerCarrera();
  }

  obtenerCarrera()
  {
    const unsubscribeCarrera = this.carrerasService.obtenerCarrera(this.data.idCarreras)
    .valueChanges()
    .subscribe(carrera => {
      this.carrera = carrera;
      this.elegirContenido();
      unsubscribeCarrera.unsubscribe();
    },
    ()=>{
      this.mensajeError('No se pudo obtener los datos necesarios');
      this.dialog.close();
    });
  }

  elegirContenido()
  {
    switch (this.data.campoEdit)
    {
      case 'descripción':
        this.contenido = this.carrera.descripcion;
      break;
      case 'introducción':
        this.contenido = this.carrera.introduccion;
      break;
      case 'contenido':
        this.contenido = this.carrera.contenido;
      break;
      case 'duración':
        this.contenido = this.carrera.duracion;
      break;
      case 'requisitos previos':
        this.contenido = this.carrera.requisitosPrevios;
      break;
      case 'dirigido a':
        this.contenido = this.carrera.dirigido;
      break;
      case 'evaluación de aprendizaje':
        this.contenido = this.carrera.evaluacion;
      break;
      case 'requisitos para calificación':
        this.contenido = this.carrera.requisitosCalificacion;
      break;
    }
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  validarContenido()
  {
    if (this.contenido)
    {
      this.editarCarrera();
      this.carrerasService.actualizarDescripcionCarrera(this.carrera, this.data.idCarreras)
      .then(()=>{this.dialog.close();}
      ,()=>{this.mensajeError('No se pudo editar, por favor intente otra vez')});
    }
    else
    {
      this.mensajeInformativo('El campo no puede estar vacío');
    }
  }

  editarCarrera()
  {
    switch (this.data.campoEdit)
    {
      case 'descripción':
        this.carrera.descripcion = this.contenido;
      break;
      case 'introducción':
        this.carrera.introduccion = this.contenido;
      break;
      case 'contenido':
        this.carrera.contenido = this.contenido;
      break;
      case 'duración':
        this.carrera.duracion = this.contenido;
      break;
      case 'requisitos previos':
        this.carrera.requisitosPrevios = this.contenido;
      break;
      case 'dirigido a':
        this.carrera.dirigido = this.contenido;
      break;
      case 'evaluación de aprendizaje':
        this.carrera.evaluacion = this.contenido;
      break;
      case 'requisitos para calificación':
        this.carrera.requisitosCalificacion = this.contenido;
      break;
    }
  }

  mensajeError(mensaje:string)
  {
    Swal.fire({
      icon:'error',
      text:mensaje,
      confirmButtonText:'Cerrar'
    })
  }

  mensajeInformativo(mensaje:string)
  {
    Swal.fire({
      icon:'info',
      text:mensaje,
      confirmButtonText:'Cerrar'
    })
  }


}
