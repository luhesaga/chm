import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '../lesson-create/lesson-create.component';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  styleUrls: ['./lecciones.component.scss']
})
export class LeccionesComponent implements OnInit, OnDestroy {

  CourseId: string;
  receivedCourse;
  course;

  constructor(
    private activatedRoute: ActivatedRoute,
    private couseService: CourseService,
    private route: Router,
    public dialog: MatDialog,
  ) {
    this.CourseId = this.activatedRoute.snapshot.params.id
    console.log(this.CourseId);
  }

  ngOnInit(): void {
    this.receivedCourse = this.couseService.detailCourse(this.CourseId)
      .valueChanges()
      .subscribe(curso => {
        this.course = curso;
      })
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    this.receivedCourse.unsubscribe();
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
