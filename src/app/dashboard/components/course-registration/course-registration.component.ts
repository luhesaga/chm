import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { LogsService } from '../../../core/services/logs/logs.service';
import { UsersService } from '../../../core/services/users/users.service';
import { MailService } from '../../../core/services/mail/mail.service';
import { CarrerasService } from '../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.scss'],
})
export class CourseRegistrationComponent implements OnInit, OnDestroy {
  userId: string;
  noCourses = true;
  careerId: string;
  careerView = false;
  careerUser: any;
  std = false;

  listcourse: any[] = [];
  unfilteredCourses: any[] = [];

  student: any;

  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private careerService: CarrerasService,
    private user: UsersService,
    private mailService: MailService,
    private logs: LogsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = this.activatedRoute.snapshot.params.stdId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    if (this.activatedRoute.snapshot.params.std) {
      this.std = true;
    }
  }

  ngOnInit(): void {
    if (this.careerView) {
      this.getCareerUserInfo();
    } else {
      this.getUserInfo();
    }
  }

  ngOnDestroy(): void {
    // this.coursesByUserReceived.unsubscribe();
  }

  getCareerUserInfo(): void {
    const user = this.careerService.getRegisteredUser(this.careerId, this.userId)
        .valueChanges()
        .subscribe(u => {
          this.careerUser = u;
          this.getCourses();
          user.unsubscribe();
        });
  }

  getUserInfo(): void {
    const userInfo = this.user
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
          if (!this.careerView) {
            this.getUserCourses(course);
          } else {
            this.getCareerCourses(course);
          }
        });
        coursesList.unsubscribe();
      });
  }

  getCategory(course): void {
    const categories = this.catService
      .detailCategory(course.categoria)
      .valueChanges()
      .subscribe((cat) => {
        course.categoria = cat.nombre;
        categories.unsubscribe();
      });
  }

  getUserCourses(course): void {
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

  getCareerCourses(course): void {
    const careerCourse = this.careerService.getCareerCourseData(this.careerId, course.id)
      .valueChanges()
      .subscribe(cc => {
        if (cc) {
          this.noCourses = false;
          if (this.careerUser.tipoMatricula === 'indefinida') {
            course.tipoMatricula = 'Indefinida';
          } else {
            course.tipoMatricula = `termina el ${this.formatDate(
              this.careerUser.fechaFinalizacionMatricula
            )}`;
          }
          const data = {
            curso: course.id,
            estudiante: this.userId,
            nombreEstudiante:
              this.careerUser.nombre,
            nombreCurso: course.nombre,
          };
          // console.log(cc);
          // console.log(data);
          this.getLog(data, course, this.careerUser.fechaFinalizacionMatricula);
          careerCourse.unsubscribe();
        }
      });
  }

  getLog(data, course, fechaFin): void {
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

  goToCourseHome(idCourse: string): void {
    if (!this.careerView) {
      this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}`);
    } else if (this.careerView && !this.std) {
      this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}/${this.careerId}`);
    } else {
      this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}/${this.careerId}/${'std'}`);
    }
  }

  goToCourseList(): void {
    this.router.navigate([`cursos/list/${this.userId}`]);
  }

  formatDate(date): string {
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

  formatDateLastIn(date, data): string {
    const ultimoIngreso = new Date(date.seconds * 1000);
    const hoy = new Date();
    const resta = hoy.getTime() - ultimoIngreso.getTime();
    const dias = Math.round(resta / (1000 * 60 * 60 * 24));
    if (dias >= 15) {
      data.ultimoIngreso = ultimoIngreso.toLocaleString();
      data.diasSinVisita = dias;
      this.sendEmail(data);
    }
    console.log(`dias sin entrar: ${dias}`);
    return ultimoIngreso.toLocaleString();
  }

  sendEmail(data): void {
    data.to = this.student.correo;
    data.asunto = `${data.nombreEstudiante}, queremos saber de ti`;
    const unsubscribe = this.mailService.daysValidationEmail(data).subscribe(
      () => unsubscribe.unsubscribe(),
      (e) => {
        console.log(e);
      }
    );
    console.log('correo enviado.');
  }

  goBack(): void {
    if (!this.std) {
      this.router.navigate([`dashboard/carreras/index/${this.careerId}/${'admin'}`]);
    } else {
      this.router.navigate([`dashboard/carreras/index/${this.careerId}/${'std'}`]);
    }
  }
}
