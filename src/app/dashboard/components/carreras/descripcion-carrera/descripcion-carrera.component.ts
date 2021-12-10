import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { DescripcionEditComponent } from './descripcion-edit/descripcion-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-descripcion-carrera',
  templateUrl: './descripcion-carrera.component.html',
  styleUrls: ['./descripcion-carrera.component.scss'],
})
export class DescripcionCarreraComponent implements OnInit, OnDestroy {
  carrera: any;
  unsubscribeCarrera: Subscription;

  constructor(
    public dialog: MatDialogRef<DescripcionCarreraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    private carrerasService: CarrerasService
  ) {
    this.carrera = {};
  }

  ngOnDestroy() {
    this.unsubscribeCarrera.unsubscribe();
  }
  ngOnInit(): void {
    this.obtenerCarrera();
  }

  obtenerCarrera() {
    this.unsubscribeCarrera = this.carrerasService
      .obtenerCarrera(this.data.id)
      .valueChanges()
      .subscribe(
        (carrera) => {
          this.carrera = carrera;
          this.mostrarCarrera();
        },
        () => {
          this.mensajeError('Error de conexión');
          this.dialog.close();
        }
      );
  }

  mostrarCarrera() {
    if (this.carrera.descripcion) {
      let descripcion = document.getElementById('descripcion-carrera');
      if (descripcion) {
        descripcion.innerHTML = this.carrera.descripcion;
      }
      
    } else {
      document.getElementById('descripcion-carrera').innerHTML = 'No establecido';
    }
    if (this.carrera.introduccion) {
      document.getElementById('introduccion').innerHTML =
        this.carrera.introduccion;
    } else {
      document.getElementById('introduccion').innerHTML = 'No establecido';
    }
    if (this.carrera.contenido) {
      document.getElementById('contenido').innerHTML = this.carrera.contenido;
    } else {
      document.getElementById('contenido').innerHTML = 'No establecido';
    }
    if (this.carrera.objetivo) {
      document.getElementById('objetivo').innerHTML = this.carrera.objetivo;
    } else {
      document.getElementById('objetivo').innerHTML = 'No establecido';
    }
    if (this.carrera.duracion) {
      document.getElementById('duracion').innerHTML = this.carrera.duracion;
    } else {
      document.getElementById('duracion').innerHTML = 'No establecido';
    }
    if (this.carrera.requisitosPrevios) {
      document.getElementById('requisitosPrevios').innerHTML =
        this.carrera.requisitosPrevios;
    } else {
      document.getElementById('requisitosPrevios').innerHTML = 'No establecido';
    }
    if (this.carrera.dirigido) {
      document.getElementById('dirigido').innerHTML = this.carrera.dirigido;
    } else {
      document.getElementById('dirigido').innerHTML = 'No establecido';
    }
    if (this.carrera.evaluacion) {
      document.getElementById('evaluacion').innerHTML = this.carrera.evaluacion;
    } else {
      document.getElementById('evaluacion').innerHTML = 'No establecido';
    }
    if (this.carrera.requisitosCalificacion) {
      document.getElementById('requisitosCalificacion').innerHTML =
        this.carrera.requisitosCalificacion;
    } else {
      document.getElementById('requisitosCalificacion').innerHTML =
        'No establecido';
    }
  }

  descriptionEdit(campoEdit: string) {
    const config = {
      data: {
        campoEdit,
        idCarreras: this.data.id,
      },
    };
    this.editDialog.open(DescripcionEditComponent, config);
  }

  descriptionDelete(campoEdit: string) {
    switch (campoEdit) {
      case 'descripción':
        this.carrera.descripcion = '';
        break;
      case 'introducción':
        this.carrera.introduccion = '';
        break;
      case 'Objetivos':
        this.carrera.objetivo = '';
        break;
      case 'contenido':
        this.carrera.contenido = '';
        break;
      case 'duración':
        this.carrera.duracion = '';
        break;
      case 'requisitos previos':
        this.carrera.requisitosPrevios = '';
        break;
      case 'dirigido a':
        this.carrera.dirigido = '';
        break;
      case 'evaluación de aprendizaje':
        this.carrera.evaluacion = '';
        break;
      case 'requisitos para calificación':
        this.carrera.requisitosCalificacion = '';
        break;
    }

    this.actualizarDescripcionCarrera(campoEdit);
  }

  actualizarDescripcionCarrera(campoEdit: string) {
    this.carrerasService
      .actualizarDescripcionCarrera(this.carrera, this.data.id)
      .then(
        () => {},
        () => {
          this.mensajeError('No se pudo eliminar ' + campoEdit);
        }
      );
  }

  mensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      text: mensaje,
      confirmButtonText: 'Cerrar',
    });
  }
}
