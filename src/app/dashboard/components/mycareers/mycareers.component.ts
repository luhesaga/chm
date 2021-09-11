import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrerasService } from '../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-mycareers',
  templateUrl: './mycareers.component.html',
  styleUrls: ['./mycareers.component.scss']
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

  getCareers() {
    let careersList = this.careerService.obtenerCarreras()
      .valueChanges()
      .subscribe(careers => {
        // console.log(careers)
        this.getRegisteredUsers(careers);
        // console.log(this.userCareers);
        careersList.unsubscribe();
      })
  }

  getRegisteredUsers(careers) {
    this.userCareers = [];
    careers.forEach(c => {
      let userCareer = this.careerService.getRegisteredUser(c.id, this.userId)
        .valueChanges()
        .subscribe((uc: any) => {
          if (uc) {
            // console.log(uc);
            let career = {
              id: c.id,
              nombre: c.nombre,
              imagen: c.imagen,
              fechaFin: uc.fechaFinalizacionMatricula
            }
            this.userCareers.push(career);
            console.log(this.userCareers);
          }
          userCareer.unsubscribe();
        });
    });
  }

}
