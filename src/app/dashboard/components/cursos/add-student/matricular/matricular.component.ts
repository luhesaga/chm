import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-matricular',
  templateUrl: './matricular.component.html',
  styleUrls: ['./matricular.component.scss']
})
export class MatricularComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'estado', 'actions'];
  dataSource = new MatTableDataSource();

  students:any[];
  studentsDesmatriculado:any[];
  lessons:any[];
  content:any[];


  constructor(
    private courseService: CourseService,
    private lessonService: LessonsService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<MatricularComponent>,
    @Inject(MAT_DIALOG_DATA) public idCurso:any
  )
  {
    this.content = [];
    this.studentsDesmatriculado=[];
    this.getLessons();
    this.obtenerListaEstudiante();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  matricularEstudiante(estudiante:any, estadoMatricula:string)
  {
    const contenidoCurso = {
      lessons: this.lessons,
      content: this.content
    }
    this.userService.verificarMatriculaDelEstudiante(estudiante.id, this.idCurso, contenidoCurso);
    this.estudiantesMatriculadosCurso(estudiante, estadoMatricula);
  }

  estudiantesMatriculadosCurso(estudiante:any, estadoMatricula:string)
  {
    if(estadoMatricula=== 'matricular')
    {
      let nombreEstudiante = estudiante.nombres+' '+estudiante.apellidos;
      this.courseService.addEnrolledStudents(nombreEstudiante,this.idCurso, estudiante.id);
    }
    else
    {
      this.courseService.deleteEnrolledStudent(this.idCurso, estudiante.id);
    }
  }

}
