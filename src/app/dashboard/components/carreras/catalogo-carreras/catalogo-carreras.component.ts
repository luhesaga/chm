import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { MatDialog } from '@angular/material/dialog';
import { CarrerasInfoComponent } from './carreras-info/carreras-info.component';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogo-carreras',
  templateUrl: './catalogo-carreras.component.html',
  styleUrls: ['./catalogo-carreras.component.scss']
})
export class CatalogoCarrerasComponent implements OnInit,OnDestroy {

  carreras:any[];
  userId:string;
  unsubscribe: Subscription;

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

  ngOnDestroy(){
    this.unsubscribe.unsubscribe();
  }

  obtenerCarreras()
  {
    this.unsubscribe= this.carrerasService.obtenerCarreras()
    .valueChanges()
    .subscribe(carreras => {
      this.carreras = this.estrellasCarreras(carreras);
    });
  }

  estrellasCarreras(carreras:any[])
  {
    carreras.forEach(carrera => {
      const estrellas:any[] = carrera.calificacionEstrellas;
      carrera.nroVotos = estrellas.length;
      this.haVotadoElUsuario(carrera);
    });
    return carreras;
  }

  haVotadoElUsuario(carrera:any)
  {
    const estrellas:any[] = carrera.calificacionEstrellas;
    const encontrado = estrellas.findIndex(calificacion => calificacion.idUsuario == this.userId);
    if(encontrado === -1)
    {
      carrera.haVotado= false;
    }
    else
    {
      carrera.haVotado= true;
    }
    this.promedioVotos(carrera);
    console.log(carrera);
  }

  promedioVotos(carrera:any)
  {
    let promedio =0;
    const estrellas:any[] = carrera.calificacionEstrellas;
    estrellas.forEach(calificacion => {promedio +=calificacion.calificacion});
    if(estrellas.length>0)
    {
      promedio = Number.parseFloat(((promedio/estrellas.length).toString()));
    }
    carrera.promedio= promedio.toFixed(1);
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

  agregarEstrella(calificacion:number, item:any)
  {
    const data={
      calificacion,
      idUsuario: this.userId
    };
    const estrellas:any[] = item.calificacionEstrellas;
    estrellas.push(data);
    this.carrerasService.agregarEstrella(estrellas, item.id)
    .then(()=>{
      if(calificacion>1)
      {
        this.successSwal(`Gracias por su calificación de ${calificacion} estrellas`,'')
      }else
      {
        this.successSwal(`Gracias por su calificación de ${calificacion} estrella`,'')
      }
      },
      (e)=>{
        this.errorsSwal('No se pudo calificar la carrera.','Por favor intentelo mas tarde')
        console.log(e)});
  }

  successSwal(title:string, message:string)
  {
    Swal.fire({
      icon:'success',
      title,
      text:message,
      confirmButtonText:'Aceptar',
    });
  }

  errorsSwal(title:string, message:string)
  {
    Swal.fire({
      icon:'error',
      title,
      text:message,
      confirmButtonText:'Cerrar',
    });
  }

}
