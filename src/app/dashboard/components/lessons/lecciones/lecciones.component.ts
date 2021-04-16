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
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  styleUrls: ['./lecciones.component.scss']
})
export class LeccionesComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'actions'];
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
    console.log(this.CourseId);
  }

  ngOnInit(): void {
    this.receivedCourse = this.couseService.detailCourse(this.CourseId)
      .valueChanges()
      .subscribe(curso => {
        this.course = curso;
        this.lessonService.listLessons(curso.id).valueChanges()
          .subscribe(lessons => {
            console.log(lessons);
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

  createLesson() {
    const config = {
      data: {
        message: this.course ? 'Editar leccion' : 'Agregar nueva leccion',
        content: this.course
      }
    };

    const dialogRef = this.dialog.open(LessonCreateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

}
