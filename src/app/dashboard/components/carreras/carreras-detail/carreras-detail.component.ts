import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import Swal from 'sweetalert2';
import { CheckoutComponent } from '../../payu/checkout/checkout.component';

@Component({
  selector: 'app-carreras-detail',
  templateUrl: './carreras-detail.component.html',
  styleUrls: ['./carreras-detail.component.scss'],
})
export class CarrerasDetailComponent implements OnInit {
  panelOpenState = false;

  idCarrera: string;
  carrera: any;
  idUser: string;
  home: string;

  user;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carrerasService: CarrerasService,
    private route: Router,
    private auth: AuthService,
    public dialog: MatDialog
  ) {
    this.idCarrera = this.activatedRoute.snapshot.params.idCarreras;
    this.idUser = this.activatedRoute.snapshot.params.idUser;
    this.home = this.activatedRoute.snapshot.params.home;
  }

  ngOnInit(): void {
    this.obtenerCarrera();
    const getUser = this.auth.user$.subscribe((u) => {
      this.user = u;
      getUser.unsubscribe();
    });
  }

  obtenerCarrera(): void {
    const careerReceived = this.carrerasService
      .obtenerCarrera(this.idCarrera)
      .valueChanges()
      .subscribe(
        (carrera) => {
          this.carrera = carrera;
          this.mostrarDescipcion();
          careerReceived.unsubscribe();
        },
        () => {
          console.log('error');
        }
      );
  }

  mostrarDescipcion(): void {
    document.getElementById('descripcion').innerHTML = this.carrera.descripcion;
  }

  mostrarIntroduccion(): void {
    document.getElementById('introduccion').innerHTML =
      this.carrera.introduccion;
  }

  mostrarObjetivos(): void {
    document.getElementById('objetivos').innerHTML = this.carrera.objetivo;
  }

  mostrarContenido(): void {
    document.getElementById('contenido').innerHTML = this.carrera.contenido;
  }

  mostrarDuracion(): void {
    document.getElementById('duracion').innerHTML = this.carrera.duracion;
  }

  mostrarRequisitosPrevios(): void {
    document.getElementById('requisitosPrevios').innerHTML =
      this.carrera.requisitosPrevios;
  }

  mostrarDirigidoA(): void {
    document.getElementById('dirigido').innerHTML = this.carrera.dirigido;
  }

  mostrarEvaluacion(): void {
    document.getElementById('evaluacion').innerHTML = this.carrera.evaluacion;
  }

  mostrarRequisitosCalificacion(): void {
    document.getElementById('requisitosCalificacion').innerHTML =
      this.carrera.requisitosCalificacion;
  }

  goToBuy(): void {
    if (this.home) {
      Swal.fire({
        title: 'Comprar carrera',
        text: 'Para adquirir nuestra carrera debes estar registrado, ¿deseas registrarte?',
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
      this.carrerasService.getRegisteredUser(this.idCarrera, this.user.id)
        .valueChanges()
        .subscribe(user => {
          if (user) {
            Swal.fire({
              title: `${this.carrera.nombre}`,
              text: 'Ya estas inscrito en esta carrera.',
              icon: 'info',
            });
          } else {
            this.openDialog();
          }
        });
    }
  }

  openDialog(): void {
    const config = {
      data: {
        message: 'carrera',
        user: this.user,
        course: this.carrera
      },
    };

    const dialogRef = this.dialog.open(CheckoutComponent, config);
    dialogRef.afterClosed().subscribe(() => {});
  }

  goBack(): void {
    if (!this.home) {
      this.route.navigate([`/dashboard/carreras/catalogo/${this.idUser}`]);
    } else {
      this.route.navigate(['/home/cursos']);
    }
  }
}
