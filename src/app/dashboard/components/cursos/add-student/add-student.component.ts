import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { MatricularComponent } from './matricular/matricular.component';
import { CourseService } from 'src/app/core/services/courses/course.service';
import Swal from 'sweetalert2';

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
  course;
  students:any;
  enrolledStudents: any[];
  lessons:any[];
  content:any[];

  constructor(
    private courseService: CourseService,
    private lessonService: LessonsService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
  )
  {
    this.content = [];
    this.enrolledStudents = [];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.getLessons();
    this.obtenerListaEstudianteMatriculados();
  }

  ngOnInit(): void {
    this.getCourse();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog()
  {
    const dialogRef = this.dialog.open(MatricularComponent,{
      height: '90%',
      width: '80%',
      data:this.idCurso
    });
  }

  getCourse() {
    let courseReceived = this.courseService.detailCourse(this.idCurso)
      .valueChanges()
      .subscribe(c => {
        this.course = c;
        console.log(this.course);
        courseReceived.unsubscribe();
      });
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

  obtenerListaEstudianteMatriculados():void
  {
    this.courseService.obtenerEstudiantesMatriculados(this.idCurso)
    .valueChanges()
    .subscribe(estudiantesMatriculados => this.dataSource.data = estudiantesMatriculados);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  matricularEstudiante(estudiante:any)
  {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción desmatricula de este curso al estudiante seleccionado! ¿Esta seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        const contenidoCurso = {}
        this.userService.verificarMatriculaDelEstudiante(estudiante.id, this.idCurso, contenidoCurso);
        this.courseService.deleteEnrolledStudent(this.idCurso, estudiante.id)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Estudiante desmatriculado exitosamente',
            confirmButtonText: 'cerrar',
        });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: 'Ocurrió un error' + error,
        confirmButtonText: 'cerrar',
            });
        });
      }
    })
    .catch(error => console.log(error));
  }

  goBack() {
    this.router.navigate([`dashboard/cursos`]);
  }

}
