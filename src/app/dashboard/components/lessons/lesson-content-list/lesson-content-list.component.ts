import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '../lesson-create/lesson-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-lesson-content-list',
  templateUrl: './lesson-content-list.component.html',
  styleUrls: ['./lesson-content-list.component.scss']
})
export class LessonContentListComponent implements OnInit {

  displayedColumns: string[] = ['posicion', 'titulo', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  CourseId: string;
  LessonId: string;
  receivedContent;
  course;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public dialog: MatDialog,
    private lessonService: LessonsService
  ) {
    this.CourseId = this.activatedRoute.snapshot.params.cid;
    this.LessonId = this.activatedRoute.snapshot.params.lid;
    console.log(this.CourseId);
  }

  ngOnInit(): void {
    this.receivedContent = this.lessonService.listLessonContent(this.CourseId, this.LessonId)
      .valueChanges()
      .subscribe((contenido: any) => {
        console.log(contenido);
        this.dataSource.data = contenido;
        })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    this.receivedContent.unsubscribe();
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

  levelDown(data) {
    // console.log(data);
    if (data.posicion < this.dataSource.data.length) {
      let actualContent: any = this.dataSource.data[data.posicion - 1];
      let nextContent: any = this.dataSource.data[data.posicion];

      // actualizar posicion elemento actual
      this.positionEdit(
        actualContent.id,
        actualContent.posicion + 1
      );
      // actualizar posicion elemento siguiente
      this.positionEdit(
        nextContent.id,
        nextContent.posicion - 1
      );
    }
  }

  levelUp(data) {
    // console.log(data);
    if (data.posicion > 1) {
      let actualContent: any = this.dataSource.data[data.posicion - 1];
      let previousContent: any = this.dataSource.data[data.posicion - 2];

      // actualizar posicion elemento actual
      this.positionEdit(
        actualContent.id,
        actualContent.posicion -1
      );
      // actualizar posicion elemento previo
      this.positionEdit(
        previousContent.id,
        previousContent.posicion + 1
      );
    }
  }

  positionEdit(id, pos) {
    if (pos > 0) {
      const cId = this.CourseId;
      const lId = this.LessonId;
      this.lessonService.editLessonContentPosition(cId, lId, id, pos)
        .catch((error) => console.error(error));
    }
  }

  goBack() {
    this.route.navigate([`cursos/index/${this.CourseId}`]);
  }

  goToConfig(id) {
    this.route.navigate([`cursos/${this.CourseId}/lecciones/config/${id}`]);
  }

}
