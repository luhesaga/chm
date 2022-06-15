import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from './course-info/course-info.component';
import { CourseService } from '../../../core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CheckoutComponent } from 'src/app/dashboard/components/payu/checkout/checkout.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  cursos;
  userId;
  dashboard = false;
  coursesReceived;
  user;

  constructor(
    public dialog: MatDialog,
    public courseService: CourseService,
    private catService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private auth: AuthService,
  ) {
    this.userId = this.activatedRoute.snapshot.params.userId;
    if (this.userId) {
      this.dashboard = true;
    }
  }

  ngOnInit(): void {
    this.getCourses();
    const getUser = this.auth.user$.subscribe(u => {
      this.user = u;
      getUser.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.coursesReceived) {
      this.coursesReceived.unsubscribe();
    }
  }

  getCourses(): void {
    this.coursesReceived = this.courseService
      .listCourses()
      .valueChanges()
      .subscribe((courses) => {
        this.getCourseCategory(courses);
        this.getUsersRating(courses);
      });
  }

  getCourseCategory(courses): void {
    courses.forEach((c) => {
      const category = this.catService
        .detailCategory(c.categoria)
        .valueChanges()
        .subscribe((cat) => {
          c.categoria = cat.nombre;
          category.unsubscribe();
        });
    });
  }

  getUsersRating(courses): void {
    courses.forEach((c) => {
      c.precioAMostrar = c.precioCOP ? c.precioCOP : 0;
      c.moneda = 'COP';
      c.mensajeMoneda = 'Ver precio en USD.';
      c.promedio = c.estrellas
        ? Number.parseFloat((c.estrellas / c.votos).toString()).toFixed(1)
        : '0';
      const userRating = this.courseService
        .getUserStars(this.userId, c.id)
        .valueChanges()
        .subscribe((u) => {
          if (u) {
            c.haVotado = true;
          } else {
            c.haVotado = false;
          }
          userRating.unsubscribe();
        });
    });
    this.cursos = courses;
  }

  openDialog(data): void {
    const config = {
      data: {
        message: 'informacion del curso',
        content: data,
      },
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result ${result}`);
    });
  }

  goToCourseDetail(courseId): void {
    if (this.dashboard) {
      this.route.navigate([
        `/dashboard/cursos/detalle/${courseId}/${this.userId}`,
      ]);
    } else {
      this.route.navigate([`/home/detalle-curso/${courseId}`]);
    }
  }

  agregarEstrella(calificacion: number, item: any): void {
    const data = {
      idCurso: item.id,
      calificacion,
      idUsuario: this.userId,
      estrellasAcum: item.estrellas
        ? item.estrellas + calificacion
        : calificacion,
      votosAcum: item.votos ? item.votos + 1 : 1,
    };
    this.courseService
      .setStarsAndVotes(data)
      .then(() => {
        this.courseService.agregarEstrella(data).then(() => {
          if (calificacion > 1) {
            this.successSwal(
              `Gracias por su calificación de ${calificacion} estrellas`,
              ''
            );
          } else {
            this.successSwal(
              `Gracias por su calificación de ${calificacion} estrella`,
              ''
            );
          }
        })
        .catch((e) => {
          this.errorsSwal(
            'No se pudo calificar el curso.',
            'Por favor intentelo mas tarde'
          );
          console.log(e);
        });
      })
      .catch((err) => console.log(err));
  }

  bloquearVotoAlCurso(item: any): void {
    const indexCurso: number = this.cursos.findIndex(
      (curso) => curso.id === item.id
    );
    this.cursos[indexCurso].haVotado = true;
  }

  successSwal(title: string, message: string): void {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
    });
  }

  errorsSwal(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'Cerrar',
    });
  }

  changePriceToShow(course): void {
    if (course.precioAMostrar) {
      if (course.precioAMostrar === course.precioCOP) {
        course.precioAMostrar = course.precioUSD;
        course.moneda = 'USD';
        course.mensajeMoneda = 'Ver precio en COP.';
      } else {
        course.precioAMostrar = course.precioCOP;
        course.moneda = 'COP';
        course.mensajeMoneda = 'Ver precio en USD.';
      }
    }
  }

  goToBuy(item: any): void {
    // console.log(item);
    if (!this.dashboard) {
      Swal.fire({
        title: 'Comprar curso',
        text: 'Para adquirir nuestros cursos debes estar registrado, ¿deseas registrarte?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo registrarme!'
      })
        .then((result) => {
          if (result.value) {
            this.route.navigate(['home/register']);
          }
        })
        .catch(error => console.log(error));
    } else {
      const registerCheck = this.courseService.registeredUSerDetail(item.id, this.user.id)
        .valueChanges()
        .subscribe(user => {
          if (user) {
            Swal.fire({
              title: `${item.nombre}`,
              text: 'Ya estas inscrito en este curso.',
              icon: 'info',
            });
          } else {
            this.openCheckout(item);
          }
          registerCheck.unsubscribe();
        });
    }
  }

  openCheckout(item: any): void {
    const config = {
      data: {
        message: 'curso',
        user: this.user,
        course: item
      },
    };

    const dialogRef = this.dialog.open(CheckoutComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result ${result}`);
    });
  }
}
