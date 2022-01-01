import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from '../../../../../core/services/users/users.service';
import { LessonsService } from '../../../../../core/services/lessons/lessons.service';
import { ExercisesService } from '../../../../../core/services/exercises/exercises.service';
import { ForumService } from '../../../../../core/services/forums/forum.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-evaluations-home',
  templateUrl: './evaluations-home.component.html',
  styleUrls: ['./evaluations-home.component.scss'],
})
export class EvaluationsHomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Estudiante', 'Correo'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  courseId: string;
  courseName: string;
  data: any;
  modulos: any;

  careerId: string;
  careerView = false;
  stdId: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private userService: UsersService,
    private lessonService: LessonsService,
    private exerciseService: ExercisesService,
    private foroService: ForumService
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    if (this.careerId) {
      this.careerView = true;
    }
  }

  ngOnInit(): void {
    this.getCourseInfo();
    this.getCourseUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourseInfo(): void {
    const curso = this.courseService
      .detailCourse(this.courseId)
      .valueChanges()
      .subscribe((c) => {
        this.courseName = c.nombre;
        curso.unsubscribe();
      });
  }

  getCourseUsers(): void {
    this.data = [];
    this.modulos = [];
    const courseUsers = this.courseService
      .listRegisteredUsers(this.courseId)
      .valueChanges()
      .subscribe((users: any) => {
        users.forEach((user, index) => {
          this.data.push({ idUsuario: user.id });
          this.getUserData(user, index);
        });
        this.dataSource.data = this.data;
        courseUsers.unsubscribe();
      });
  }

  getUserData(user, index): void {
    const detailUser = this.userService
      .detailUser(user.id)
      .valueChanges()
      .subscribe((u: any) => {
        this.data[index].Estudiante = u.nombres + ' ' + u.apellidos;
        this.data[index].Correo = u.correo;
        this.getCourseLessons(index);
        detailUser.unsubscribe();
      });
  }

  getCourseLessons(i): void {
    const lessonsList = this.lessonService
      .listLessons(this.courseId)
      .valueChanges()
      .subscribe((lessons: any) => {
        lessons.forEach((lesson) => {
          this.getlessonContent(lesson, i);
        });
        lessonsList.unsubscribe();
      });
  }

  getlessonContent(lesson, index): void {
    this.data[index].contenidos = [];

    const contentList = this.lessonService
      .listCalificableLessons(this.courseId, lesson.id)
      .valueChanges()
      .subscribe((content) => {
        if (content.length > 0) {
          content.forEach((c: any) => {
            if (index === 0) {
              this.displayedColumns.push(c.titulo);
            }
            if (c.tipo === 'Agregar foro') {
              const ejercicio: any = {
                idContenido: c.id,
                tituloContenido: c.titulo,
                idLeccion: lesson.id,
              };
              this.getForumResult(ejercicio, this.data[index].idUsuario, index);
            } else {
              const ejercicio: any = {
                idContenido: c.ejercicio.id,
                tituloContenido: c.ejercicio.nombre,
                idLeccion: lesson.id,
              };
              this.getUSerResult(ejercicio, this.data[index].idUsuario, index);
            }
          });
        }
        contentList.unsubscribe();
      });
  }

  getUSerResult(ejercicio, stdId, index): void {
    const userTest = this.exerciseService
      .getUserAnswers(this.courseId, ejercicio.idContenido, stdId)
      .valueChanges()
      .subscribe((item: any) => {
        let valor = 0;
        let mayor = 0;
        if (item.length > 0) {
          item.forEach((prueba) => {
            valor = 0;
            if (prueba.respuestas.length > 0) {
              prueba.respuestas.forEach((r) => {
                valor += r.valor;
              });
            }
            if (valor > 0) {
              valor = Math.ceil(
                (valor / (prueba.respuestas.length * 100)) * 100
              );
              if (valor > mayor) {
                mayor = valor;
              }
            } else {
              valor = 0;
            }
          });
        }
        ejercicio.valor = mayor;
        this.data[index].contenidos.push(ejercicio);
        userTest.unsubscribe();
      });
  }

  getForumResult(ejercicio, stdId, index): void {
    const forumResult = this.foroService
      .getUserAnswers(
        this.courseId,
        ejercicio.idLeccion,
        ejercicio.idContenido,
        stdId
      )
      .valueChanges()
      .subscribe((f: any) => {
        if (f.length > 0) {
          ejercicio.valor = f[0].valor;
        } else {
          ejercicio.valor = 0;
        }
        this.data[index].contenidos.push(ejercicio);
        forumResult.unsubscribe();
      });
  }

  setField(item, i, element): any {
    if (this.displayedColumns.indexOf('Promedio') === -1) {
      this.displayedColumns.push('Promedio');
    }
    let fieldValue = '';
    if (item !== 'Promedio') {
      if (element) {
        if (element[item]) {
          fieldValue = element[item];
        } else {
          if (element?.contenidos) {
            if (element.contenidos.length > 0) {
              fieldValue = element.contenidos[i - 3]?.valor + '%';
            }
          }
        }
      }
    } else {
      let valor = 0;
      if (element?.contenidos) {
        if (element.contenidos.length > 0) {
          for (let index = 0; index < element.contenidos.length; index++) {
            const el = element.contenidos[index];
            valor = valor + el.valor;
          }
          valor = Math.ceil(valor / element.contenidos.length);
          fieldValue = valor + '%';
        }
      }
    }

    return fieldValue;
  }

  exportAsExcel(): void {
    /* converts a DOM TABLE element to a worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `Evaluaciones curso ${this.courseName}.xlsx`);
  }

  goBack(): void {
    if (!this.careerView) {
      this.router.navigate([`cursos/index/${this.courseId}`]);
    } else {
      this.router.navigate([`cursos-carrera/index/${this.courseId}/${this.stdId}/${this.careerId}`]);
    }
  }
}
