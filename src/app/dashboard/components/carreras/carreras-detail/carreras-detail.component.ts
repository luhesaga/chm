import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carreras-detail',
  templateUrl: './carreras-detail.component.html',
  styleUrls: ['./carreras-detail.component.scss']
})
export class CarrerasDetailComponent implements OnInit {

  panelOpenState = false;

  idCarrera:string;
  carrera:any;
  idUser:string;
  home:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carrerasService: CarrerasService,
    private route: Router,
  )
  {
    this.idCarrera = this.activatedRoute.snapshot.params.idCarreras;
    this.idUser = this.activatedRoute.snapshot.params.idUser;
    this.home = this.activatedRoute.snapshot.params.home;

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

  goToBuy() {
    if (this.home) {
      Swal.fire({
        title: 'Comprar carrera',
        text: 'Para adquirir nuestra carrera debes estar registrado, ¿deseas registrarte?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo registrarme!'
      })
      .then((result) => {
        if (result.value) {
          this.route.navigate(['home/register']);
        }
      })
      .catch(error => console.log(error));
    } else {
      Swal.fire({
        width: '25rem',
        title:'<div style="color:black">Compra de la carrera</div>',
        html: '<style type="text/css"> .correo, .whatsapp{margin-top:1rem;} .enlace{ margin-bottom:1rem;} .mensaje{text-align: justify;}</style><div class="mensaje">Puede comprar su curso o paquete de cursos con su tarjeta de Crédito, Débito, cuenta Paypal, Western union, Money Gram, Transferencia bancaria, PSE y otros medios de pago.</div><div class="correo"> Solicita información escribiendo al correo:</div> <div class="enlace"><a href="mailto:comercial@chym-ndt.com" style="text-decoration: none; color:#007279;">comercial@chym-ndt.com</a></div> <div class="whatsapp"> O al whatsapp:</div> <div style="display:flex; justify-content:center; height:3rem; align-items:center; background:#1bd741; border-radius:5px; width:11rem; margin:auto;"><a style="text-decoration:none; display:flex; align-items:center; justify-content:center; color:white;" href="https://api.whatsapp.com/send?phone=573108045337&text=Gracias%20por%20comunicarte%20con%20nosotros,%20deja%20tu%20mensaje%20y%20nos%20pondremos%20en%20contacto%20contigo" target="_blank"><div><img src="https://firebasestorage.googleapis.com/v0/b/chym-e-learning.appspot.com/o/documentos%2Ficons%2FiconWhatsapp.png?alt=media&token=481b5145-ed4c-4365-98ef-03a4553d6102" style="width:2.4rem; height:2.5rem;" /> Ir al whatsapp <div></a></div>',
        confirmButtonText: 'Cerrar',
        confirmButtonColor:'#007279'
    });
    }
  }

  goBack() {
    if (!this.home) {
      this.route.navigate([`/dashboard/carreras/catalogo/${this.idUser}`]);
    } else {
      this.route.navigate(['/home/cursos']);
    }
  }


}
