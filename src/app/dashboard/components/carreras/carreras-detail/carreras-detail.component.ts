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
    .subscribe(carrera => {
      this.carrera = carrera;
      this.mostrarDescipcion();
    },
      ()=>{console.log('error')});
  }


  mostrarDescipcion(){
    document.getElementById('descripcion').innerHTML = this.carrera.descripcion;
  }

  mostrarIntroduccion()
  {
    document.getElementById('introduccion').innerHTML = this.carrera.introduccion;
  }

  mostrarObjetivos()
  {
    document.getElementById('objetivos').innerHTML = this.carrera.objetivo;
  }

  mostrarContenido()
  {
    document.getElementById('contenido').innerHTML = this.carrera.contenido;
  }

  mostrarDuracion()
  {
    document.getElementById('duracion').innerHTML = this.carrera.duracion;
  }

  mostrarRequisitosPrevios()
  {
    document.getElementById('requisitosPrevios').innerHTML = this.carrera.requisitosPrevios;
  }

  mostrarDirigidoA()
  {
    document.getElementById('dirigido').innerHTML = this.carrera.dirigido;
  }

  mostrarEvaluacion()
  {
    document.getElementById('evaluacion').innerHTML = this.carrera.evaluacion;
  }

  mostrarRequisitosCalificacion()
  {
    document.getElementById('requisitosCalificacion').innerHTML = this.carrera.requisitosCalificacion;
  }

}
