import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.scss']
})
export class CourseRegistrationComponent implements OnInit, OnDestroy {

  userId;
  coursesByUserReceived;
  coursesReceived;
  categoryreceived;

  listcourse: any[] = [];
  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.listcourse.length = 0;
    this.userId = this.activatedRoute.snapshot.params.stdId;
    // console.log(this.userId);
  }

  ngOnInit(): void {
    this.obtenerCourse();
  }

  ngOnDestroy(): void {
    this.coursesReceived.unsubscribe();
    this.categoryreceived.unsubscribe();
    this.coursesByUserReceived.unsubscribe();
  }

  obtenerCourse(): void {
    this.listcourse.length = 0;
    this.coursesReceived = this.courseService.listCourses()
      .valueChanges()
      .subscribe(courses => {
        courses.forEach(course => {
          // console.log(course.nombre);
          this.categoryreceived = this.catService.detailCategory(course.categoria).valueChanges()
            .subscribe(cat => {
              course.categoria = cat.nombre;
            });
          this.coursesByUserReceived = this.courseService.listCoursesByUser(course.id, this.userId)
            .valueChanges()
            .subscribe(u => {
              if (u) {
                // console.log(`curso: ${course.nombre} --- user: ${u.nombre}`);
                this.listcourse.push(course);
              }
            })
        });
        this.listcourse = [... new Set(this.listcourse)];
        // console.log(this.listcourse);
      });
  }

  goToCourseHome(idCourse: string) {
    // this.router.navigateByUrl('cursos/registration/'+idCourse);
    this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}`);
  }
}
