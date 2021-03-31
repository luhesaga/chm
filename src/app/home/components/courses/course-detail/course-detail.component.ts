import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  panelOpenState = false;
  cursos = [];
  id;

  // divs para inyectar html
  descDiv;
  objDiv;
  contDiv;
  durDiv;
  reqDiv;
  dirDiv;
  evalDiv;
  calDiv;

  nombre;
  imagen;

  descripcion = true;
  objetivo = true;
  contenido = true;
  calificacion = true;
  duracion = true;
  requisitos = true;
  evaluacion = true;
  dirigido = true;

  // boton volver a dashboard
  dash = false;

  constructor(
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    if (this.id.substring(0,4) === 'view') {
      this.id = this.id.replace('view', '');
      this.dash = true;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.courseQuery();
  }

  async courseQuery(): Promise<void> {
    if (this.id) {
      this.courseService.detailCourse(this.id)
      .valueChanges()
      .subscribe(curso => {
        this.nombre = curso.nombre;
        this.imagen = curso.imagen;
        this.divsFill(curso);
        // console.log(curso);
      });
    }
  }

  async divsFill(curso) {
    if (curso.descripcion) {
      this.descDiv = document.getElementById('descripcion');
      this.descDiv.innerHTML = await curso.descripcion;
    } else {this.descripcion = false;}

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
