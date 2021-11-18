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
    //this.coursesReceived.unsubscribe();
    //this.categoryreceived.unsubscribe();
    //this.coursesByUserReceived.unsubscribe();
  }

  getCourses(): void {
    this.listcourse.length = 0;
    const coursesList = this.coursesReceived = this.courseService.listCourses()
      .valueChanges()
      .subscribe(courses => {
        console.log(courses);
        courses.forEach((course) => {
          this.getCategory(course);
          this.getUserCourses(course);
        });
        console.log(this.listcourse)
        coursesList.unsubscribe();
      });
  }

  getCategory(course) {
    const categories = this.catService.detailCategory(course.categoria).valueChanges()
      .subscribe(cat => {
        course.categoria = cat.nombre;
        categories.unsubscribe();
      });
  }

  getUserCourses(course) {
    const userCourses = this.courseService.listCoursesByUser(course.id, this.userId)
      .valueChanges()
      .subscribe(u => {
        if (u) {
          console.log(u.tipoMatricula);
          if (u.tipoMatricula === "indefinida") {
            course.tipoMatricula = "Indefinida"
          } else {
            course.tipoMatricula = `termina el ${this.formatDate(u.fechaFinalizacionMatricula)}`;
          }
          this.listcourse.push(course);
        }
        userCourses.unsubscribe();
      });
  }

  goToCourseHome(idCourse: string) {
    this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}`);
  }

  formatDate(date) {
    const fecha = new Date(date.seconds * 1000);
    const hoy = new Date();
    if (fecha > hoy) {
      console.log('ok');
    } else {
      console.log('mamola');
    }
    return fecha.toLocaleDateString();
  }
}
