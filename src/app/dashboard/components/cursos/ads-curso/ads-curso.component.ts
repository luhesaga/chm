import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVistaAdsComponent } from './modal-vista-ads/modal-vista-ads.component';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

export interface DialogData {
  descripcion: string;
  titulo: string;
}

@Component({
  selector: 'app-ads-curso',
  templateUrl: './ads-curso.component.html',
  styleUrls: ['./ads-curso.component.scss'],
})
export class AdsCursoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'fecha', 'actions'];
  dataSource = new MatTableDataSource();

  admin = true;
  idCurso: string;
  matriculados: any[];
  stdId: any;
  adsReceived: any;

  careerId: string;
  careerView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private careerService: CarrerasService,
    private userService: UsersService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.matriculados = [];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }

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

  ngOnDestroy(): void {
      if (this.adsReceived) {
        this.adsReceived.unsubscribe();
      }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listaAnunciosCurso(): void {
    const id = this.careerView ? this.careerId : this.idCurso;
    this.adsReceived = this.courseService
      .obtenerAnuncios(id)
      .valueChanges()
      .subscribe((anuncios) => {
        anuncios.forEach((a) => {
          a.fecha = new Date(a.fecha.seconds * 1000).toLocaleString();
        });
        this.dataSource.data = anuncios;
      });
  }

  obtenerIdMatriculados(): void {
    if (!this.careerView) {
      this.courseService
      .getRegisteredUSers(this.idCurso)
      .valueChanges()
      .subscribe((matriculados) => {
        this.matriculados = matriculados;
        console.log(this.matriculados);
      },
        () => this.mensajeErrorIdMatriculados()
      );
    } else {
      this.careerService.matriculadosObtener(this.careerId)
        .valueChanges()
        .subscribe((matriculados) => {
          this.matriculados = matriculados;
        },
          () => this.mensajeErrorIdMatriculados()
        );
    }
  }

  mensajeErrorIdMatriculados(): void {
    Swal.fire({
      icon: 'error',
      title: 'Hay un error de conexión',
      text: 'Por favor recargue la página',
    });
  }

  obtenerIdAnuncioEliminar(idAnuncio: string): void {
    this.mensajeEliminarAnuncio().then((result) => {
      if (result.value) {
        this.eliminarAnunciosEstudiante(idAnuncio);
      }
    });
  }

  mensajeEliminarAnuncio(): Promise<any> {
    return Swal.fire({
      icon: 'info',
      title: '¿Seguro desea eliminarlo?',
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: 'red',
    });
  }

  async eliminarAnunciosEstudiante(idAnuncio: string): Promise<void> {
    let i = 0;
    let sw = 0;
    while (this.matriculados.length > i && sw === 0) {
      await this.userService
        .eliminarAnuncioEstudiante(this.matriculados[i].id, idAnuncio)
        .then(
          () => '',
          () => (sw = 1)
        );
      ++i;
    }
    if (sw === 1) {
      this.mensajeErrorEliminarAnuncio();
    } else {
      this.eliminarAnuncioDelCurso(idAnuncio);
    }
  }

  mensajeErrorEliminarAnuncio(): void {
    Swal.fire({
      icon: 'error',
      title: 'Hay un error de conexión',
      text: 'Por favor intente eliminar otra vez el anuncio',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: 'red',
    });
  }

  eliminarAnuncioDelCurso(idAnuncio: string): void {
    const id = this.careerView ? this.careerId : this.idCurso;
    this.courseService.deleteAnuncio(id, idAnuncio)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Anuncio eliminado con exito!',
          confirmButtonText: 'Ok',
          confirmButtonColor: 'green',
        });
      },
      () => this.mensajeErrorEliminarAnuncio()
    );
  }

  goToEditAnuncio(idAnuncio: string): void {
    if (!this.careerView) {
      this.router.navigate([
        `/cursos/anuncios/editar/${this.idCurso}/${idAnuncio}`,
      ]);
    } else {
      this.router.navigate([
        `/carreras/anuncios/editar/${this.careerId}/${idAnuncio}`,
      ]);
    }
  }

  goBack(): void {
    if (this.admin && !this.careerView) {
      this.router.navigate([`cursos/index/${this.idCurso}`]);
    } else if (!this.admin && !this.careerView) {
      this.router.navigate([`cursos/index/${this.idCurso}/${this.stdId}`]);
    } else if (this.admin && this.careerView) {
      this.router.navigate([
        `dashboard/carreras/index/${this.careerId}/${'admin'}`,
      ]);
    } else {
      this.router.navigate([
        `dashboard/carreras/index/${this.careerId}/${'std'}`,
      ]);
    }
  }

  goToCreate(): void {
    if (!this.careerView) {
      this.router.navigate([`/cursos/anuncios/crear/${this.idCurso}`]);
    } else {
      this.router.navigate([`/carreras/anuncios/crear/${this.careerId}`]);
    }
  }

  openModalVista(element: any): void {
    const dialogRef = this.dialog.open(ModalVistaAdsComponent, {
      width: '90%',
      height: '30rem',
      data: {
        descripcion: element.descripcion,
        titulo: element.titulo,
      },
    });
  }
}
