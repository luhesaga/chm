import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.scss']
})
export class CourseRegistrationComponent implements OnInit {

  listcourse:any[];
  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private router: Router
  ) {
    this.listcourse = [];
    this.obtenerCourse();
  }

  obtenerCourse():void
  {
    this.courseService.listCourses()
    .valueChanges()
    .subscribe(courses =>
      {
        courses.forEach(course => {
          this.catService.detailCategory(course.categoria).valueChanges()
            .subscribe(cat => {
              course.categoria = cat.nombre;
            });
        });
        this.listcourse = courses;
      });
  }
  ngOnInit(): void {
  }

  goToLecciones(idCourse:string)
  {
    this.router.navigateByUrl('course-registration/lessons/'+idCourse);
  }

  goToCourseHome(idCourse:string)
  {
    this.router.navigateByUrl('cursos/registration/'+idCourse);
  }
}
