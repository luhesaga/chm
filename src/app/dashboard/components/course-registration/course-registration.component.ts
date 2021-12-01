import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { LogsService } from '../../../core/services/logs/logs.service';
import { UsersService } from '../../../core/services/users/users.service';
import { MailService } from '../../../core/services/mail/mail.service';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.scss'],
})
export class CourseRegistrationComponent implements OnInit, OnDestroy {
  userId;
  noCourses = true;

  listcourse = [];
  unfilteredCourses = [];

  student;

  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private user: UsersService,
    private mailService: MailService,
    private logs: LogsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  ngOnDestroy(): void {
    //this.coursesByUserReceived.unsubscribe();
  }

  getUserInfo() {
    let userInfo = this.user
      .detailUser(this.userId)
      .valueChanges()
      .subscribe((u) => {
        this.student = u;
        this.getCourses();
        userInfo.unsubscribe();
      });
  }

  getCourses(): void {
    this.listcourse.length = 0;
    const coursesList = this.courseService
      .listCourses()
      .valueChanges()
      .subscribe((courses) => {
        courses.forEach((course) => {
          this.getCategory(course);
          this.getUserCourses(course);
        });
        coursesList.unsubscribe();
      });
  }

  getCategory(course) {
    const categories = this.catService
      .detailCategory(course.categoria)
      .valueChanges()
      .subscribe((cat) => {
        course.categoria = cat.nombre;
        categories.unsubscribe();
      });
  }

  getUserCourses(course) {
    const userCourses = this.courseService
      .listCoursesByUser(course.id, this.userId)
      .valueChanges()
      .subscribe((u) => {
        if (u) {
          this.noCourses = false;
          if (u.tipoMatricula === 'indefinida') {
            course.tipoMatricula = 'Indefinida';
          } else {
            course.tipoMatricula = `termina el ${this.formatDate(
              u.fechaFinalizacionMatricula
            )}`;
          }
          const data = {
            curso: course.id,
            estudiante: this.userId,
            nombreEstudiante:
              this.student.nombres + ' ' + this.student.apellidos,
            nombreCurso: course.nombre,
          };
          this.getLog(data, course, u.fechaFinalizacionMatricula);
        }
        userCourses.unsubscribe();
      });
  }

  getLog(data, course, fechaFin) {
    const log = this.logs
      .getCourseInLog(data)
      .valueChanges()
      .subscribe((l) => {
        let ultimoIngreso;
        if (l) {
          ultimoIngreso = this.formatDateLastIn(l.fechaIngreso, data);
        } else {
          ultimoIngreso = 'n/a';
        }
        course.ultimoIngreso = ultimoIngreso;
        if (!this.verifyCourseRegistration(course.id, fechaFin)) {
          this.listcourse.push(course);
        }
        log.unsubscribe();
      });
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
      this.courseService
        .deleteUserFromCourse(courseId, this.userId)
        .then(() => {
          console.log('Finalizó matricula');
        })
        .catch((err) => console.log(err));
    } else {
      result = false;
      console.log('Matricula ok.');
    }

    return result;
  }

  formatDateLastIn(date, data) {
    const ultimoIngreso = new Date(date.seconds * 1000);
    const hoy = new Date();
    let resta = hoy.getTime() - ultimoIngreso.getTime();
    let dias = Math.round(resta / (1000 * 60 * 60 * 24));
    if (dias >= 15) {
      data.ultimoIngreso = ultimoIngreso.toLocaleString();
      data.diasSinVisita = dias;
      this.sendEmail(data);
    }
    console.log(`dias sin entrar: ${dias}`);
    return ultimoIngreso.toLocaleString();
  }

  sendEmail(data) {
    data.to = this.student.correo;
    data.asunto = `${data.nombreEstudiante}, queremos saber de ti`;
    //console.log(this.student);
    //console.log(data);
    const unsubscribe = this.mailService.daysValidationEmail(data).subscribe(
      () => unsubscribe.unsubscribe(),
      (e) => {
        console.log(e);
      }
    );
    console.log('correo enviado.');
  }
}
