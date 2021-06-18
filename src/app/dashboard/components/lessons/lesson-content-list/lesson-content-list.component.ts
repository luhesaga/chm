import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lesson-content-list',
  templateUrl: './lesson-content-list.component.html',
  styleUrls: ['./lesson-content-list.component.scss']
})
export class LessonContentListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['posicion', 'titulo', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  CourseId: string;
  LessonId: string;
  receivedContent;
  course;
  courseName: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public dialog: MatDialog,
    private lessonService: LessonsService
  ) {
    this.CourseId = this.activatedRoute.snapshot.params.cid;
    this.LessonId = this.activatedRoute.snapshot.params.lid;
    //console.log(this.CourseId);
  }

  ngOnInit(): void {
    this.receivedContent = this.lessonService.listLessonContent(this.CourseId, this.LessonId)
      .valueChanges()
      .subscribe((contenido: any) => {
        //console.log(contenido);
        this.dataSource.data = contenido;
        this.lessonService.lessonDetail(this.CourseId, this.LessonId).valueChanges()
          .subscribe((l: any) => {
            this.courseName = l.nombre;
          });
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

  createOrEditLessonContent() {
    const cId = this.CourseId;
    const lId = this.LessonId;
    this.route.navigate([`cursos/${cId}/lecciones/config/${lId}/${'new'}`]);
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
     console.log(data);
     console.log(this.dataSource.data);
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
    const cId = this.CourseId;
    this.route.navigate([`cursos/lecciones/${cId}`]);
  }

  goToConfig(contentId) {
    const cId = this.CourseId;
    const lId = this.LessonId;
    this.route.navigate([`cursos/${cId}/lecciones/config/${lId}/${contentId}`]);
  }

  deleteContent(data) {
    const cId = this.CourseId;
    const lId = this.LessonId;
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara este contenido permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        //console.log(data);
        this.lessonService.deleteLessonContent(cId, lId, data.id)
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

}
