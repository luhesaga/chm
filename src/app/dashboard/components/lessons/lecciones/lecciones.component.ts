import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '../lesson-create/lesson-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  styleUrls: ['./lecciones.component.scss'],
})
export class LeccionesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['posicion', 'nombre', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  CourseId: string;
  careerId: string;
  stdId: string;
  receivedCourse;
  course;

  constructor(
    private activatedRoute: ActivatedRoute,
    private couseService: CourseService,
    private route: Router,
    public dialog: MatDialog,
    private lessonService: LessonsService
  ) {
    this.CourseId = this.activatedRoute.snapshot.params.id;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.receivedCourse = this.couseService
      .detailCourse(this.CourseId)
      .valueChanges()
      .subscribe((curso) => {
        this.course = curso;
        this.lessonService
          .listLessons(curso.id)
          .valueChanges()
          .subscribe((lessons) => {
            this.dataSource.data = lessons;
          });
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    if (this.receivedCourse) {
      this.receivedCourse.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createOrEditLesson(lesson): void {
    const leccion: any = {
      courseId: this.CourseId,
      cantLecciones: this.dataSource.data.length,
    };
    if (lesson) {
      leccion.lessonId = lesson.id;
      leccion.lessonName = lesson.nombre;
    }
    const config = {
      data: {
        message: lesson ? 'Editar leccion' : 'Agregar nueva leccion',
        content: leccion,
      },
    };

    const dialogRef = this.dialog.open(LessonCreateComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result ${result}`);
    });
  }

  deleteLesson(data): void {
    // console.log(data);
    // eliminar leccion
    const cId = this.CourseId;

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara esta lección permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    })
      .then((result) => {
        if (result.value) {
          const pos = data.posicion;
          // actualizar posiciones
          if (pos !== this.dataSource.data.length) {
            for (let i = pos; i < this.dataSource.data.length; i++) {
              const lesson: any = this.dataSource.data[i];
              this.positionEdit(lesson.id, lesson.posicion - 1);
            }
          }
          this.lessonService
            .deleteLesson(cId, data.id)
            .then(() => {
              Swal.fire('Eliminado!', 'Eliminación exitosa.', 'success');
            })
            .catch((error) => {
              Swal.fire(
                'Error!',
                `La operación no se pudó realizar, ${error}.`,
                'error'
              );
            });
        }
      })
      .catch((error) => console.log(error));
  }

  levelDown(data): void {
    // console.log(data);
    if (data.posicion < this.dataSource.data.length) {
      const actualLesson: any = this.dataSource.data[data.posicion - 1];
      const nextLesson: any = this.dataSource.data[data.posicion];

      // actualizar posicion elemento actual
      this.positionEdit(actualLesson.id, actualLesson.posicion + 1);
      // actualizar posicion elemento siguiente
      this.positionEdit(nextLesson.id, nextLesson.posicion - 1);
    }
  }

  levelUp(data): void {
    // console.log(data);
    if (data.posicion > 1) {
      const actualLesson: any = this.dataSource.data[data.posicion - 1];
      const previousLesson: any = this.dataSource.data[data.posicion - 2];

      // actualizar posicion elemento actual
      this.positionEdit(actualLesson.id, actualLesson.posicion - 1);
      // actualizar posicion elemento previo
      this.positionEdit(previousLesson.id, previousLesson.posicion + 1);
    }
  }

  positionEdit(id, pos): void {
    if (pos > 0) {
      const cId = this.CourseId;
      this.lessonService
        .editLessonPosition(cId, id, pos)
        .catch((error) => console.error(error));
    }
  }

  goBack(): void {
    console.log(this.careerId);
    if (!this.careerId) {
      this.route.navigate([`cursos/index/${this.CourseId}`]);
    } else {
      this.route.navigate([
        `cursos-carrera/index/${this.CourseId}/${this.stdId}/${this.careerId}`,
      ]);
    }
  }

  goToConfig(id): void {
    this.route.navigate([
      `cursos/${this.CourseId}/lecciones/content-list/${id}`,
    ]);
  }
}
