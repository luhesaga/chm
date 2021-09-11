import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import {MatDialog} from '@angular/material/dialog';
import { ModalVistaAdsComponent } from './modal-vista-ads/modal-vista-ads.component';

export interface DialogData {
  descripcion: string;
  titulo: string;
}

@Component({
  selector: 'app-ads-curso',
  templateUrl: './ads-curso.component.html',
  styleUrls: ['./ads-curso.component.scss']
})
export class AdsCursoComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource();

  admin = true;
  idCurso: string;
  matriculados:any[];
  stdId:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private userService: UsersService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.matriculados =[];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.stdId = this.activatedRoute.snapshot.params.stdId;

    if (this.stdId) {
      this.admin = false;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.obtenerIdMatriculados();
    this.listaAnunciosCurso();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listaAnunciosCurso()
  {
    this.courseService.obtenerAnuncios(this.idCurso)
    .valueChanges()
    .subscribe(anuncios => this.dataSource.data=anuncios);
  }

  obtenerIdMatriculados()
  {
    this.courseService.getRegisteredUSers(this.idCurso)
    .valueChanges()
    .subscribe(matriculados => this.matriculados=matriculados,
    ()=> this.mensajeErrorIdMatriculados());
  }

  mensajeErrorIdMatriculados()
  {
    Swal.fire({
      icon: 'error',
      title: 'Hay un error de conexión',
      text: 'Por favor recargue la página'
    })
  }

  obtenerIdAnuncioEliminar(idAnuncio:string)
  {
    this.mensajeEliminarAnuncio().then(result => {
      if(result.value)
      {
        this.eliminarAnunciosEstudiante(idAnuncio);
      }
    })
  }

  mensajeEliminarAnuncio()
  {
    return Swal.fire({
      icon:'info',
      title: '¿Seguro desea eliminarlo?',
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText:'No',
      cancelButtonColor:'red'
    });
  }

  async eliminarAnunciosEstudiante(idAnuncio:string)
  {
    let i=0, sw=0;
    while(this.matriculados.length>i && sw===0)
    {
      await this.userService.eliminarAnuncioEstudiante(this.matriculados[i].id, idAnuncio).then(()=>'',
      ()=> sw=1);
      ++i;
    }
    if(sw===1)
    {
      this.mensajeErrorEliminarAnuncio();
    }
    else
    {
      this.eliminarAnuncioDelCurso(idAnuncio);
    }
  }

  mensajeErrorEliminarAnuncio()
  {
    Swal.fire({
      icon: 'error',
      title: 'Hay un error de conexión',
      text: 'Por favor intente eliminar otra vez el anuncio',
      confirmButtonText:'Cerrar',
      confirmButtonColor:'red'
    })
  }

  eliminarAnuncioDelCurso(idAnuncio:string)
  {
    this.courseService.deleteAnuncio(this.idCurso, idAnuncio).then(()=>'', 
    ()=> this.mensajeErrorEliminarAnuncio());
  }

  goToEditAnuncio(idAnuncio:string)
  {
    this.router.navigate([`/cursos/anuncios/editar/${this.idCurso}/${idAnuncio}`]);
  }

  goBack() {

    if (this.admin) {
      this.router.navigate([`cursos/index/${this.idCurso}`]);
    } else {
      this.router.navigate([`cursos/index/${this.idCurso}/${this.stdId}`]);
    }
  }

  openModalVista(element:any) {
    const dialogRef = this.dialog.open(ModalVistaAdsComponent,{
      width: '90%',
      height:'30rem',
      data:{
        descripcion:element.descripcion,
        titulo: element.titulo
      }
    });
  }


}
