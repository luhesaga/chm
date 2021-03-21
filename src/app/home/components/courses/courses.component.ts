import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from './course-info/course-info.component';
import { CourseService } from '../../../core/services/courses/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  cursos;

  constructor(
    public dialog: MatDialog,
    public courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.cursos = this.courseService.listCourses().valueChanges();
  }

  openDialog(data): void {
    const config = {
      data: {
        message: data ? 'Editar usuario' : 'Agregar nuevo usuario',
        content: data
      }
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

}
