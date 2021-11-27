import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { MatricularComponent } from './matricular/matricular.component';
import { CourseService } from 'src/app/core/services/courses/course.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'nombre',
    'correo',
    'perfil',
    'fecha',
    'actions',
  ];
  dataSource = new MatTableDataSource();

  idCurso: string;
  course;
  students: any;
  enrolledStudents: any[];
  lessons: any[];
  content: any[];
  activeMassive;
  selected;
  unsubscribe = false;
  usersToUnsubscribe: any[] = [];

  constructor(
    private courseService: CourseService,
    private lessonService: LessonsService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private auth: AuthService
  ) {
    this.content = [];
    this.enrolledStudents = [];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
  }

  ngOnInit(): void {
    this.getCourse();
    this.getLessons();
    this.getRegisteredUSers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog() {
    const dialogRef = this.dialog.open(MatricularComponent, {
      height: '90%',
      width: '90%',
      data: [this.course, this.dataSource.data],
    });
  }

  getCourse() {
    let courseReceived = this.courseService
      .detailCourse(this.idCurso)
      .valueChanges()
      .subscribe((c) => {
        this.course = c;
        courseReceived.unsubscribe();
      });
  }

  getLessons() {
    let unsubscribe = this.lessonService
      .listLessons(this.idCurso)
      .valueChanges()
      .subscribe((lessons) => {
        this.lessons = lessons;
        this.getContent();
        unsubscribe.unsubscribe();
      });
  }

  getContent() {
    this.lessons.forEach((lesson) => {
      lesson.realizada = false;
      let unsubscribe = this.lessonService
        .listLessonContent(this.idCurso, lesson.id)
        .valueChanges()
        .subscribe((content) => {
          let contenido: any;
          content.forEach((c) => {
            contenido = {
              realizado: false,
              idContent: c.id,
              titulo: c.titulo,
              idLesson: lesson.id,
            };
            this.content.push(contenido);
          });
          unsubscribe.unsubscribe();
        });
    });
  }

  getRegisteredUSers(): void {
    this.courseService
      .getRegisteredUSers(this.idCurso)
      .valueChanges()
      .subscribe((students) => {
        students.forEach((std) => {
          this.userService
            .detailUser(std.id)
            .valueChanges()
            .subscribe((user: any) => {
              std.perfil = user.perfil;
              std.correo = user.correo;
              std.fechaCreacion = user.fechaCreacion
                ? new Date(user.fechaCreacion).toLocaleDateString()
                : '';
            });
        });
        this.dataSource.data = this.sortStudents(students);
      });
  }

  sortStudents(students) {
    return students.sort(function (a, b) {
      if (a.nombre > b.nombre) {
        return 1;
      }
      if (a.nombre < b.nombre) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteStudent(estudiante: any) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción desmatricula de este curso al estudiante seleccionado! ¿Esta seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    })
      .then((result) => {
        if (result.value) {
          this.courseService
            .deleteUserFromCourse(this.idCurso, estudiante.id)
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
      .catch((error) => console.log(error));
  }

  goBack() {
    this.router.navigate([`dashboard/cursos`]);
  }

  massiveUnsubscribe(event: MatCheckboxChange) {
    if (event.checked) {
      this.displayedColumns = [
        'sel',
        'nombre',
        'correo',
        'perfil',
        'fecha',
        'actions',
      ];
      this.unsubscribe = true;
    } else {
      this.displayedColumns = [
        'nombre',
        'correo',
        'perfil',
        'fecha',
        'actions',
      ];
      this.unsubscribe = false;
    }
  }

  checkAllUsers(event: MatCheckboxChange) {
    this.dataSource.data.forEach((d: any) => {
      event.checked ? (d.seleccionado = true) : (d.seleccionado = false);
    });
    this.usersToUnsubscribe = this.getSelectedStudents();
    // console.log(this.usersToUnsubscribe);
  }

  individualStudentSelected(event: MatCheckboxChange) {
    if (!event.checked) {
      this.selected = false;
    }
    this.usersToUnsubscribe = this.getSelectedStudents();
    // console.log(this.usersToUnsubscribe);
  }

  getSelectedStudents(): any[] {
    const unsubscribe = this.dataSource.data.filter(
      (x: any) => x.seleccionado === true
    );
    if (unsubscribe.length === this.dataSource.data.length) {
      this.selected = true;
    } else {
      this.selected = false;
    }
    return unsubscribe;
  }

  unsubscribeSelectedUsers() {
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta acción desmatriculará de este curso ${this.usersToUnsubscribe.length} 
              estudiantes, el proceso puede tardar unos minutos, por favor no cierre el
              navegador hasta recibir el mensaje de confirmación. ¿Esta seguro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    })
      .then((result) => {
        if (result.value) {
          this.usersToUnsubscribe.forEach((u) => {
            this.courseService
              .deleteUserFromCourse(this.idCurso, u.id)
              .then(() => {
                console.log(`estudiante: ${u.nombre} desmatriculado.`);
              })
              .catch((error) => console.log(error));
          });
          this.selected = false;
          this.activeMassive =false;
          this.displayedColumns = [
            'nombre',
            'correo',
            'perfil',
            'fecha',
            'actions',
          ];
          this.unsubscribe = false;
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: `${this.usersToUnsubscribe.length} estudiantes desmatriculados exitosamente.`,
            confirmButtonText: 'cerrar',
          });
          this.usersToUnsubscribe.length = 0;
        }
      })
      .catch((error) => console.log(error));
  }
}
