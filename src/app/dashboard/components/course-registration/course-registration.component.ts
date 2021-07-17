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

  listcourse = [];
  unfilteredCourses = [];

  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy(): void {
    this.coursesReceived.unsubscribe();
    this.categoryreceived.unsubscribe();
    this.coursesByUserReceived.unsubscribe();
  }

  getCourses(): void {
    this.listcourse.length = 0;
    this.coursesReceived = this.courseService.listCourses()
      .valueChanges()
      .subscribe(courses => {
        courses.forEach((course) => {
          this.getCategory(course);
          this.getUserCourses(course);
        });
        // console.log(this.listcourse)
      });
  }

  getCategory(course) {
    this.categoryreceived = this.catService.detailCategory(course.categoria).valueChanges()
      .subscribe(cat => {
        course.categoria = cat.nombre;
      });
  }

  getUserCourses(course) {
    this.coursesByUserReceived = this.courseService.listCoursesByUser(course.id, this.userId)
      .valueChanges()
      .subscribe(u => {
        // futuro desarrollador:
        // no se porque carajo se repetían algunas veces los cursos
        // pequeña empanada pa solucionarlo :(
        let cont = 0
        this.listcourse.forEach(c => {
          if (c.id === course.id) {
            cont += 1
          }
        })
        if (u && cont === 0) {
          this.listcourse.push(course);
        }
      });
  }

  goToCourseHome(idCourse: string) {
    this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}`);
  }
}
