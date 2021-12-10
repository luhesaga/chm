import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrerasService } from '../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-mycareers',
  templateUrl: './mycareers.component.html',
  styleUrls: ['./mycareers.component.scss'],
})
export class MycareersComponent implements OnInit {
  userId: string;
  userCareers: any;

  constructor(
    private careerService: CarrerasService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCareers();
  }

  getCareers(): void {
    const careersList = this.careerService
      .obtenerCarreras()
      .valueChanges()
      .subscribe((careers) => {
        this.getRegisteredUsers(careers);
        careersList.unsubscribe();
      });
  }

  getRegisteredUsers(careers): void {
    this.userCareers = [];
    careers.forEach((c) => {
      const userCareer = this.careerService
        .getRegisteredUser(c.id, this.userId)
        .valueChanges()
        .subscribe((uc: any) => {
          if (uc) {
            this.userCareers.push(this.setUserCareer(c, uc));
          }
          userCareer.unsubscribe();
        });
    });
  }

  setUserCareer(careerData, userOpt): any  {
    const endDate =
      userOpt.fechaFinalizacionMatricula === 'nunca'
        ? 'nunca'
        : new Date(userOpt.fechaFinalizacionMatricula.seconds * 1000);

    return {
      id: careerData.id,
      nombre: careerData.nombre,
      imagen: careerData.image,
      fechaFin: endDate,
    };
  }

  goToCareersList(): void {
    this.router.navigate([`/dashboard/carreras/catalogo/${this.userId}`]);
  }

  goToCareerIndex(careerId): void {
    // this.router.navigate([`/dashboard/mis-carreras/cursos/${careerId}/${this.userId}`]);
    this.router.navigate([`dashboard/carreras/index/${careerId}/${'std'}`]);
  }
}
