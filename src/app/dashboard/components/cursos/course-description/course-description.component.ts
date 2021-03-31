import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseEditComponent } from '../course-edit/course-edit.component';

@Component({
  selector: 'app-course-description',
  templateUrl: './course-description.component.html',
  styleUrls: ['./course-description.component.scss']
})
export class CourseDescriptionComponent implements OnInit {

  course;
  DescDiv;
  IntroDiv;
  ObjDiv;
  ContDiv;
  DurDiv;
  ReqDiv;
  DirDiv;
  EvalDiv;
  CalDiv;

  constructor(
    public dialog: MatDialogRef<CourseDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.course = {
      id: this.data.content.id,
      nombre: this.data.content.nombre,
      descripcion: this.data.content.descripcion,
      objetivo: this.data.content.objetivo,
      introduccion: this.data.content.introduccion,
      contenido: this.data.content.contenido,
      duracion: this.data.content.duracion,
      requisitos: this.data.content.requisitos,
      dirigido: this.data.content.dirigido,
      evaluacion: this.data.content.evaluacion,
      calificacion: this.data.content.calificacion
    }
    console.log(this.course);
    this.DescDiv = document.getElementById('descripcion');
    if (this.course.descripcion) {
      this.DescDiv.innerHTML = this.data.content.descripcion;
    } else { this.DescDiv.innerHTML ='No establecido' }

    this.IntroDiv = document.getElementById('introduccion');
    if (this.course.introduccion) {
      this.IntroDiv.innerHTML = this.data.content.introduccion;
    } else { this.IntroDiv.innerHTML ='No establecido' }

    this.ObjDiv = document.getElementById('objetivo');
    if (this.course.objetivo) {
      this.ObjDiv.innerHTML = this.data.content.objetivo;
    } else { this.ObjDiv.innerHTML ='No establecido' }

    this.ContDiv = document.getElementById('contenido');
    if (this.course.contenido) {
      this.ContDiv.innerHTML = this.data.content.contenido;
    } else { this.ContDiv.innerHTML ='No establecido' }

    this.DurDiv = document.getElementById('duracion');
    if (this.course.duracion) {
      this.DurDiv.innerHTML = this.data.content.duracion;
    } else { this.DurDiv.innerHTML ='No establecido' }

    this.ReqDiv = document.getElementById('requisitos');
    if (this.course.requisitos) {
      this.ReqDiv.innerHTML = this.data.content.requisitos;
    } else { this.ReqDiv.innerHTML ='No establecido' }

    this.DirDiv = document.getElementById('dirigido');
    if (this.course.dirigido) {
      this.DirDiv.innerHTML = this.data.content.dirigido;
    } else { this.DirDiv.innerHTML ='No establecido' }

    this.EvalDiv = document.getElementById('evaluacion');
    if(this.course.evaluacion) {
      this.EvalDiv.innerHTML = this.data.content.evaluacion;
    } else {this.EvalDiv.innerHTML ='No establecido'}

    this.CalDiv = document.getElementById('calificacion');
    if(this.course.calificacion) {
      this.CalDiv.innerHTML = this.data.content.calificacion;
    } else {this.CalDiv.innerHTML ='No establecido'}
  }

  descriptionEdit(type: string) {
    this.course.type = type;
    //this.dialog.close();
    const config = {
      data: {
        message: this.course ? 'Editar curso' : 'Agregar nuevo cursos',
        content: this.course
      }
    };

    const dialogRef = this.editDialog.open(CourseEditComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
      if (result) {
        if (this.course.type === 'descripcion') {
          this.DescDiv.innerHTML = result;
          this.course.descripcion = result;
        }
        if (this.course.type === 'introduccion') {
          this.IntroDiv.innerHTML = result;
          this.course.introduccion = result;
        }
        if (this.course.type === 'objetivo') {
          this.ObjDiv.innerHTML = result;
          this.course.objetivo = result;
        }
        if (this.course.type === 'contenido') {
          this.ContDiv.innerHTML = result;
          this.course.contenido = result;
        }
        if (this.course.type === 'duracion') {
          this.DurDiv.innerHTML = result;
          this.course.duracion = result;
        }
        if (this.course.type === 'requisitos') {
          this.ReqDiv.innerHTML = result;
          this.course.requisitos = result;
        }
        if (this.course.type === 'dirigido') {
          this.DirDiv.innerHTML = result;
          this.course.dirigido = result;
        }
        if (this.course.type === 'evaluacion') {
          this.EvalDiv.innerHTML = result;
          this.course.evaluacion = result;
        }
        if (this.course.type === 'calificacion') {
          this.CalDiv.innerHTML = result;
          this.course.calificacion = result;
        }
      }
    });
  }

}
