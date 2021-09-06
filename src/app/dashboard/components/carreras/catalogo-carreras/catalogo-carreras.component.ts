import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { MatDialog } from '@angular/material/dialog';
import { CarrerasInfoComponent } from './carreras-info/carreras-info.component';

@Component({
  selector: 'app-catalogo-carreras',
  templateUrl: './catalogo-carreras.component.html',
  styleUrls: ['./catalogo-carreras.component.scss']
})
export class CatalogoCarrerasComponent implements OnInit {

  carreras:any[];
  userId:string;

  constructor(
    public dialog: MatDialog,
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

  openDialog(dataCarrera): void {
    const config = {
      data: {
        message: 'informacion de la carrera',
        content: dataCarrera
      }
    };

    const dialogRef = this.dialog.open(CarrerasInfoComponent, config);
  }

}
