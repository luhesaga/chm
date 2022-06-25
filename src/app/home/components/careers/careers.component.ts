import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../../core/services/carreras/carreras.service';
import { CarrerasInfoComponent } from 'src/app/dashboard/components/carreras/catalogo-carreras/carreras-info/carreras-info.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CheckoutComponent } from 'src/app/dashboard/components/payu/checkout/checkout.component';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss'],
})
export class CareersComponent implements OnInit, OnDestroy {
  carreras = [];
  userId;
  dashboard = false;
  careersReceived;
  user;

  constructor(
    public dialog: MatDialog,
    public courseService: CourseService,
    private careerService: CarrerasService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private auth: AuthService
  ) {
    this.userId = this.activatedRoute.snapshot.params.idUser;
    if (this.userId) {
      this.dashboard = true;
    }
  }

  ngOnInit(): void {
    this.getCareers();
    const getUser = this.auth.user$.subscribe((u) => {
      this.user = u;
      getUser.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.careersReceived) {
      this.careersReceived.unsubscribe();
    }
  }

  getCareers(): void {
    let careers;
    this.careersReceived = this.careerService
      .obtenerCarreras()
      .valueChanges()
      .subscribe((c) => {
        careers = this.getUsersRating(c);
        careers.forEach(car => {
          if (car.visible) {
            this.carreras.push(car);
          }
        });
      });
  }

  getUsersRating(careers): void {
    careers.forEach((carrera) => {
      carrera.precioAMostrar = carrera.precioCOP ? carrera.precioCOP : 0;
      carrera.moneda = 'COP';
      carrera.mensajeMoneda = 'Ver precio en USD.';
      const estrellas: any[] = carrera.calificacionEstrellas;
      carrera.nroVotos = estrellas.length;
      this.haVotadoElUsuario(carrera);
    });
    return careers;
  }

  haVotadoElUsuario(carrera: any): void {
    const estrellas: any[] = carrera.calificacionEstrellas;
    const encontrado = estrellas.findIndex(
      (calificacion) => calificacion.idUsuario === this.userId
    );
    if (encontrado === -1) {
      carrera.haVotado = false;
    } else {
      carrera.haVotado = true;
    }
    this.promedioVotos(carrera);
  }

  promedioVotos(carrera: any): void {
    let promedio = 0;
    const estrellas: any[] = carrera.calificacionEstrellas;
    estrellas.forEach((calificacion) => {
      promedio += calificacion.calificacion;
    });
    if (estrellas.length > 0) {
      promedio = Number.parseFloat((promedio / estrellas.length).toString());
    }
    carrera.promedio = promedio.toFixed(1);
  }

  openDialog(data): void {
    const config = {
      data: {
        message: 'informacion de la carrera',
        content: data,
      },
    };

    this.dialog.open(CarrerasInfoComponent, config);
  }

  goToCourseDetail(courseId): void {
    if (this.dashboard) {
      this.route.navigate([
        `dashboard/carreras/detail/dash/${courseId}/${this.userId}`,
      ]);
    } else {
      this.route.navigate([`/carreras/detail/${courseId}/${'home'}`]);
    }
  }

  agregarEstrella(calificacion: number, item: any): void {
    const data = {
      calificacion,
      idUsuario: this.userId,
    };
    const estrellas: any[] = item.calificacionEstrellas;
    estrellas.push(data);
    this.careerService.agregarEstrella(estrellas, item.id).then(
      () => {
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
      },
      (e) => {
        this.errorsSwal(
          'No se pudo calificar la carrera.',
          'Por favor intentelo mas tarde'
        );
        console.log(e);
      }
    );
  }

  bloquearVotoAlCurso(item: any): void {
    const indexCurso: number = this.carreras.findIndex(
      (curso) => curso.id === item.id
    );
    this.carreras[indexCurso].haVotado = true;
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
    if (!this.dashboard) {
      Swal.fire({
        title: 'Comprar curso',
        text: 'Para adquirir nuestros cursos debes estar registrado, ¿deseas registrarte?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo registrarme!',
      })
        .then((result) => {
          if (result.value) {
            this.route.navigate(['home/register']);
          }
        })
        .catch((error) => console.log(error));
    } else {
      const registerCheck = this.careerService
        .getRegisteredUser(item.id, this.user.id)
        .valueChanges()
        .subscribe((user) => {
          if (user) {
            Swal.fire({
              title: `${item.nombre}`,
              text: 'Ya estas inscrito en esta carrera.',
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
        message: 'carrera',
        user: this.user,
        course: item,
      },
    };

    const dialogRef = this.dialog.open(CheckoutComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result ${result}`);
    });
  }
}
