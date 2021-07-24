import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '../lesson-create/lesson-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { element } from 'protractor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  styleUrls: ['./lecciones.component.scss']
})
export class LeccionesComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['posicion', 'nombre', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  CourseId: string;
  receivedCourse;
  course;

  constructor(
    private activatedRoute: ActivatedRoute,
    private couseService: CourseService,
    private route: Router,
    public dialog: MatDialog,
    private lessonService: LessonsService
  ) {
    this.CourseId = this.activatedRoute.snapshot.params.id
    // console.log(this.CourseId);
  }

  ngOnInit(): void {
    this.receivedCourse = this.couseService.detailCourse(this.CourseId)
      .valueChanges()
      .subscribe(curso => {
        this.course = curso;
        this.lessonService.listLessons(curso.id).valueChanges()
          .subscribe(lessons => {
            // console.log(lessons);
            this.dataSource.data = lessons;
          })
      })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    this.receivedCourse.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createOrEditLesson(lesson) {

    let leccion:any = {
      courseId: this.CourseId,
      cantLecciones:  this.dataSource.data.length
    }
    if (lesson) {
      leccion.lessonId = lesson.id;
      leccion.lessonName = lesson.nombre;
    }
    const config = {
      data: {
        message: lesson ? 'Editar leccion' : 'Agregar nueva leccion',
        content: leccion
      }
    };

    const dialogRef = this.dialog.open(LessonCreateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

  deleteLesson(data) {
    // console.log(data);
    const cId = this.CourseId;

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara esta lección permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        this.lessonService.deleteLesson(cId, data.id)
        .then(() => {
          Swal.fire(
            'Eliminado!',
            'Eliminación exitosa.',
            'success',
          );
        })
        .catch((error) => {
          Swal.fire(
            'Error!',
            `La operación no se pudó realizar, ${error}.`,
            'error',
          );
        });
      }
    })
    .catch(error => console.log(error));
  }


  levelDown(data) {
    // console.log(data);
    if (data.posicion < this.dataSource.data.length) {
      let actualLesson: any = this.dataSource.data[data.posicion - 1];
      let nextLesson: any = this.dataSource.data[data.posicion];

      // actualizar posicion elemento actual
      this.positionEdit(
        actualLesson.id,
        actualLesson.posicion + 1
      );
      // actualizar posicion elemento siguiente
      this.positionEdit(
        nextLesson.id,
        nextLesson.posicion - 1
      );
    }
  }

  levelUp(data) {
    // console.log(data);
    if (data.posicion > 1) {
      let actualLesson: any = this.dataSource.data[data.posicion - 1];
      let previousLesson: any = this.dataSource.data[data.posicion - 2];

      // actualizar posicion elemento actual
      this.positionEdit(
        actualLesson.id,
        actualLesson.posicion -1
      );
      // actualizar posicion elemento previo
      this.positionEdit(
        previousLesson.id,
        previousLesson.posicion + 1
      );
    }
  }

  positionEdit(id, pos) {
    if (pos > 0) {
      const cId = this.CourseId;
      this.lessonService.editLessonPosition(cId, id, pos)
        .catch((error) => console.error(error));
    }
  }

  goBack() {
    this.route.navigate([`cursos/index/${this.CourseId}`]);
  }

  goToConfig(id) {
    this.route.navigate([`cursos/${this.CourseId}/lecciones/content-list/${id}`]);
  }

}
