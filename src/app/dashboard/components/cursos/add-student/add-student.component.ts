import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit, AfterViewInit  {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'estado', 'actions'];
  dataSource = new MatTableDataSource();


  idCurso:string;
  students:any;
  enrolledStudents: any[];
  lessons:any[];
  content:any[];

  constructor(
    private lessonService: LessonsService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
  )
  {
    this.content = [];
    this.enrolledStudents = [];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.getLessons();
    this.obtenerListaEstudiante();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getLessons()
  {
    let unsubscribe = this.lessonService.listLessons(this.idCurso)
    .valueChanges()
    .subscribe(lessons=> {
      this.lessons = lessons;
      this.getContent();
      unsubscribe.unsubscribe();
    });
  }

  getContent()
  {
    this.lessons.forEach(lesson =>
      {
        lesson.realzada = false;
        let unsubscribe = this.lessonService.listLessonContent(this.idCurso, lesson.id)
        .valueChanges()
        .subscribe(content => {
          let contenido: any;
          content.forEach( c => {
            contenido = {
              realizado : false,
              idContent : c.id,
              titulo: c.titulo,
              idLesson : lesson.id
            };
            this.content.push(contenido);
          });
          unsubscribe.unsubscribe();
        });
      });
  }

  obtenerListaEstudiante():void
  {
    this.userService.listUsers()
    .valueChanges()
    .subscribe(users =>
    {
      this.students=users;
      this.students.forEach( user =>
      {
        this.userService.obtenerElEstadoMatriculaEstudiante(user.id, this.idCurso)
        .valueChanges()
        .subscribe((matricula:any) =>
        {
          if(matricula)
          {
            user.matriculado = matricula.matriculado;
          }
          else
          {
            user.matriculado  = false;
          }
        });
      })
      this.dataSource.data = this.students;
    });
  }

  ngOnInit(): void {
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  matricularEstudiante(estudiante:any)
  {
    const contenidoCurso = {
      lessons: this.lessons,
      content: this.content
    }
    this.userService.verificarMatriculaDelEstudiante(estudiante.id, this.idCurso, contenidoCurso);
  }

}
