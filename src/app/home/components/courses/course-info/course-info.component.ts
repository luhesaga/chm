import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, AfterViewInit {

  curso;
  // divs para inyectar html
  IntrDiv;
  objDiv;
  contDiv;
  durDiv;
  reqDiv;
  dirDiv;
  evalDiv;
  calDiv;

  introduccion = true;
  objetivo = true;
  contenido = true;
  calificacion = true;
  duracion = true;
  requisitos = true;
  evaluacion = true;
  dirigido = true;

  constructor(
    public dialog: MatDialogRef<CourseInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.curso = this.data.content;
    // console.log(this.curso);
  }

  ngAfterViewInit(): void {
    this.divsFill(this.curso);
  }

  async divsFill(curso) {

    if (curso.introduccion) {
      this.IntrDiv = document.getElementById('introduccion');
      this.IntrDiv.innerHTML = await curso.introduccion;
    } else {this.introduccion = false;}

    if (curso.objetivo) {
      this.objDiv = document.getElementById('objetivo');
      this.objDiv.innerHTML = await curso.objetivo;
    } else {
      this.objetivo = false;
    }

    if (curso.contenido) {
      this.contDiv = document.getElementById('contenido');
      this.contDiv.innerHTML = await curso.contenido;
    } else {this.contenido = false;}

    if (curso.duracion) {
      this.durDiv = document.getElementById('duracion');
      this.durDiv.innerHTML = await curso.duracion;
    } else {this.duracion = false;}

    if (curso.requisitos) {
      this.reqDiv = document.getElementById('requisitos');
      this.reqDiv.innerHTML = await curso.requisitos;
    } else {this.requisitos = false;}

    if (curso.dirigido) {
      this.dirDiv = document.getElementById('dirigido');
      this.dirDiv.innerHTML = await curso.dirigido;
    } else {this.dirigido = false;}

    if (curso.evaluacion) {
      this.evalDiv = document.getElementById('evaluacion');
      this.evalDiv.innerHTML = await curso.evaluacion;
    } else {this.evaluacion = false;}

    if (curso.calificacion) {
      this.calDiv = document.getElementById('calificacion');
      this.calDiv.innerHTML = await curso.calificacion;
    } else {this.calificacion = false;}
  }

}
