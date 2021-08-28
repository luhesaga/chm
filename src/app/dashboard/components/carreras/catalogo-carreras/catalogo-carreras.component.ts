import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';

@Component({
  selector: 'app-catalogo-carreras',
  templateUrl: './catalogo-carreras.component.html',
  styleUrls: ['./catalogo-carreras.component.scss']
})
export class CatalogoCarrerasComponent implements OnInit {

  carreras:any[];
  userId:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carrerasService: CarrerasService
  )
  {
    this.userId = this.activatedRoute.snapshot.params.idUser;
    this.carreras = [];
    this.obtenerCarreras();
  }

  ngOnInit(): void {
  }

  obtenerCarreras()
  {
    this.carrerasService.obtenerCarreras()
    .valueChanges()
    .subscribe(carreras => {
      this.carreras = carreras;
    });
  }

}
