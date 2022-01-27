import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import { DescripcionCarreraComponent } from '../descripcion-carrera/descripcion-carrera.component';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-carreras-index',
  templateUrl: './carreras-index.component.html',
  styleUrls: ['./carreras-index.component.scss']
})
export class CarrerasIndexComponent implements OnInit {

  careerId;
  careerReceived: any;
  userType;
  admin = false;
  std = false;
  logguedUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carreraService: CarrerasService,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    this.userType = this.activatedRoute.snapshot.params.type;
    if (this.userType === 'admin') {
      this.admin = true;
    } else if (this.userType === 'std') {
      this.std = true;
    }
    // console.log(`id Carrera: ${this.careerId} admin: ${this.admin}`);
  }

  ngOnInit(): void {
    this.getLogguedUser();
    this.getCareerInfo();
  }

  getLogguedUser(): void {
    const User = this.auth.user$.subscribe(user => {
      this.logguedUser = user;
      User.unsubscribe();
    });
  }

  getCareerInfo(): void {
    const careerInfo = this.carreraService.obtenerCarrera(this.careerId)
      .valueChanges()
      .subscribe(c => {
        this.careerReceived = c;
        this.loadDescription(c);
        careerInfo.unsubscribe();
      });
  }

  loadDescription(career): void {
    const descrDiv = document.getElementById('descripcion');
    if (descrDiv) {
      descrDiv.innerHTML = career.descripcion;
    }
  }

  goBack(): void {
    if (this.admin) {
      this.router.navigate(['dashboard/carreras']);
    }
    if (this.std) {
      this.router.navigate([`/dashboard/mis-carreras/${this.logguedUser.id}`]);
    }
  }

  openDialog(): void {
    const config = {
      data: {
        id: this.careerId,
      },
      height: '40rem',
      width: '50rem',
    };
    this.dialog.open(DescripcionCarreraComponent, config);
  }

  goToCourses(): void {
    if (!this.std) {
      this.router.navigate([`dashboard/mis-cursos-lecciones-carrera/${this.logguedUser.id}/${this.careerId}`]);
    } else {
      this.router.navigate([`dashboard/mis-cursos-lecciones-carrera/${this.logguedUser.id}/${this.careerId}/${'std'}`]);
    }
  }

  goToExercises(): void {
    if (this.admin) {
      this.router.navigate([`/dashboard/cursos/ejercicios/${this.careerId}/${'career'}`]);
    }
  }

  goToAdsCurso(): void {
    if (this.admin) {
      this.router.navigate([`/dashboard/carreras/anuncios/${this.careerId}`]);
    } else {
      this.router.navigate([`/dashboard/carreras/anuncios/estudiante/${this.careerId}/${this.logguedUser.id}`]);
    }
  }

}
