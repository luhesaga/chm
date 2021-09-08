import { Component, Inject, OnInit, AfterViewInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-carreras-info',
  templateUrl: './carreras-info.component.html',
  styleUrls: ['./carreras-info.component.scss']
})
export class CarrerasInfoComponent implements OnInit, AfterViewInit {

  carrera:any;

  constructor(
    public dialog: MatDialogRef<CarrerasInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.carrera = this.data.content;
  }

  ngAfterViewInit(): void {
    this.divsFill();
  }

  divsFill()
  {
    if(this.carrera.introduccion)
    {
      document.getElementById('introduccion')
      .innerHTML= this.carrera.introduccion;
    }
    if(this.carrera.objetivo)
    {
      document.getElementById('objetivo')
      .innerHTML= this.carrera.objetivo;
    }
    if(this.carrera.contenido)
    {
      document.getElementById('contenido')
      .innerHTML= this.carrera.contenido;
    }
    if(this.carrera.duracion)
    {
      document.getElementById('duracion')
      .innerHTML= this.carrera.duracion;
    }
    if(this.carrera.requisitosPrevios)
    {
      document.getElementById('requisitos')
      .innerHTML= this.carrera.requisitosPrevios;
    }
    if(this.carrera.dirigido)
    {
      document.getElementById('dirigido')
      .innerHTML= this.carrera.dirigido;
    }
    if(this.carrera.evaluacion)
    {
      document.getElementById('evaluacion')
      .innerHTML= this.carrera.evaluacion;
    }
    if(this.carrera.requisitosCalificacion)
    {
      document.getElementById('calificacion')
      .innerHTML= this.carrera.requisitosCalificacion;
    }
  }

}
