import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from './course-info/course-info.component';
import { CourseService } from '../../../core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  cursos;

  constructor(
    public dialog: MatDialog,
    public courseService: CourseService,
    private catService: CategoryService
  ) { }

  ngOnInit(): void {
    this.courseService.listCourses().valueChanges()
    .subscribe(courses => {
      courses.forEach(c => {
        this.catService.detailCategory(c.categoria).valueChanges()
          .subscribe(cat => {
            c.categoria = cat.nombre;
          })
      })
      this.cursos = courses;
    });
  }

  openDialog(data): void {
    const config = {
      data: {
        message: 'informacion del curso',
        content: data
      }
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result ${result}`);
    });
  }

}
