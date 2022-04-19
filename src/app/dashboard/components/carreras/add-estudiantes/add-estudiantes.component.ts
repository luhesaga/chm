import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import Swal from 'sweetalert2';
import { MatricularEstudiantesCarreraComponent } from './matricular-estudiantes-carrera/matricular-estudiantes-carrera.component';
import { CourseService } from 'src/app/core/services/courses/course.service';

@Component({
  selector: 'app-add-estudiantes',
  templateUrl: './add-estudiantes.component.html',
  styleUrls: ['./add-estudiantes.component.scss'],
})
export class AddEstudiantesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'matricula'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  idCarreras: string;
  matriculados: any[];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private carrerasService: CarrerasService,
    private courseService: CourseService
  ) {
    this.idCarreras = this.activatedRoute.snapshot.params.idCarreras;
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(): void {
    this.dialog.open(MatricularEstudiantesCarreraComponent, {
      height: '90%',
      width: '90%',
      data: { idCarrera: this.idCarreras },
    });
  }

  obtenerUsuarios(): void {
    this.carrerasService
      .matriculadosObtener(this.idCarreras)
      .valueChanges()
      .subscribe(
        (users) => {
          this.dataSource.data = users;
        },
        () =>
          this.mensajeError('Error de conexión, por favor recargue la pagina')
      );
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  desmatricularUsuario(id: string): void {
    this.carrerasService.desmatricularUsuario(id, this.idCarreras).then(
      () => {
        this.mensajeExito('Desmatriculado exitosamente');
      },
      () =>
        this.mensajeError(
          'No se pudo desmatricular al usuario, por favor intente otra vez'
        )
    );
  }

  mensajeError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      text: mensaje,
      confirmButtonText: 'Cerrar',
    });
  }

  async deleteStudent(element: any): Promise<void> {
    console.log(element);
    this.mensajeDesmatricularEstudiante(element.nombre);
    let error = false;
    let i = 0;
    const ultimaMatricula = element.matriculaIndividual.length - 1;
    while (i <= ultimaMatricula && !error) {
      await this.actualizarMatriculaIndividual(
        element.matriculaIndividual[i],
        element.id
      ).then((result) => {
        error = result;
        console.log(result);
      }).catch(err => console.log(err));
      i++;
    }

    if (!error) {
      this.desmatricularUsuario(element.id);
    } else {
      this.mensajeError(
        `${element.nombre} no se pudo desmatricular, intentelo otra vez`
      );
    }
  }

  async actualizarMatriculaIndividual(
    matriculaIndividual: any,
    idEstudiante: string
  ): Promise<boolean> {
    let error;
    await this.courseService
      .updateUserOfCourse(
        matriculaIndividual,
        matriculaIndividual.cursoId,
        idEstudiante
      )
      .then(
        () => {
          error = false;
        },
        (err) => {
          error = true;
          console.log(err);
        }
      );
    return error;
  }

  mensajeDesmatricularEstudiante(nombre: string): void {
    Swal.fire({
      title: `Desmatriculando al estudiante ${nombre}`,
      confirmButtonColor: '#007279',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  mensajeExito(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      text: mensaje,
      confirmButtonText: 'Aceptar',
    });
  }

  validarDesmatricula(element: any): void {
    Swal.fire({
      icon: 'warning',
      text: `¿Seguro desea desmatricular a ${element.nombre}?`,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then((confirm) => {
      if (confirm.value) {
        this.deleteStudent(element);
      }
    });
  }
}
