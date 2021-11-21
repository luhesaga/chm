import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { LogsService } from '../../../core/services/logs/logs.service';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.scss']
})
export class CourseRegistrationComponent implements OnInit, OnDestroy {

  userId;
  noCourses = true;

  listcourse = [];
  unfilteredCourses = [];

  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private logs: LogsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy(): void {
    //this.coursesByUserReceived.unsubscribe();
  }

  getCourses(): void {
    this.listcourse.length = 0;
    const coursesList = this.courseService.listCourses()
      .valueChanges()
      .subscribe(courses => {
        courses.forEach((course) => {
          this.getCategory(course);
          this.getUserCourses(course);
        });
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
          this.noCourses = false;
          if (u.tipoMatricula === "indefinida") {
            course.tipoMatricula = "Indefinida"
          } else {
            course.tipoMatricula = `termina el ${this.formatDate(u.fechaFinalizacionMatricula)}`;
          }
          const data = {
            curso: course.id,
            estudiante: this.userId
          }
          this.getLog(data, course, u.fechaFinalizacionMatricula);
        }
        userCourses.unsubscribe();
      });
  }

  getLog(data, course, fechaFin) {
    const log = this.logs.getCourseInLog(data)
      .valueChanges()
      .subscribe(l => {
        let ultimoIngreso;
        if (l) {
          ultimoIngreso = this.formatDateLastIn(l.fechaIngreso);
        } else {
          ultimoIngreso = 'n/a'
        }
        course.ultimoIngreso = ultimoIngreso;
        if (!this.verifyCourseRegistration(course.id, fechaFin)) {
          this.listcourse.push(course);
        }
        log.unsubscribe();
      })
  }

  goToCourseHome(idCourse: string) {
    this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}`);
  }

  goToCourseList() {
    this.router.navigate([`cursos/list/${this.userId}`]);
  }

  formatDate(date) {
    const fecha = new Date(date.seconds * 1000);
    return fecha.toLocaleDateString();
  }

  verifyCourseRegistration(courseId, date): boolean {
    const hoy = new Date();
    const fecha = new Date(date.seconds * 1000);
    let result = false;
    if (fecha < hoy) {
      result = true;
      this.courseService.deleteUserFromCourse(courseId, this.userId)
        .then(() => {
          console.log('Finalizó matricula');
        })
        .catch(err => console.log(err));
    } else {
      result = false;
      console.log('Matricula ok.');
    }

    return result;
  }

  formatDateLastIn(date) {
    return new Date(date.seconds * 1000).toLocaleString();
  }
}
