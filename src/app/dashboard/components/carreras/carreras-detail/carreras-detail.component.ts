import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';

@Component({
  selector: 'app-carreras-detail',
  templateUrl: './carreras-detail.component.html',
  styleUrls: ['./carreras-detail.component.scss']
})
export class CarrerasDetailComponent implements OnInit {

  panelOpenState = false;

  idCarrera:string;
  carrera:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carrerasService: CarrerasService
  )
  {
    this.idCarrera = this.activatedRoute.snapshot.params.idCarreras;
    this.carrera ={};
    this.obtenerCarrera();
  }

  ngOnInit(): void {
  }

  obtenerCarrera()
  {
    this.carrerasService.obtenerCarrera(this.idCarrera)
    .valueChanges()
    .subscribe(carrera => this.carrera = carrera,
      ()=>{console.log('error')});
  }

}
