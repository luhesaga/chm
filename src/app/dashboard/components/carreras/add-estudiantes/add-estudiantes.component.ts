import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import Swal from 'sweetalert2';
import { MatricularEstudiantesCarreraComponent } from './matricular-estudiantes-carrera/matricular-estudiantes-carrera.component';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-add-estudiantes',
  templateUrl: './add-estudiantes.component.html',
  styleUrls: ['./add-estudiantes.component.scss'],
})
export class AddEstudiantesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'correo', 'matricula'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  idCarreras: string;
  matriculados: any[];
  careerUsers: any;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private carrerasService: CarrerasService,
    private courseService: CourseService,
    private userService: UsersService
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

  ngOnDestroy(): void {
    if (this.careerUsers) {
      this.careerUsers.unsubscribe();
    }
  }

  openDialog(): void {
    this.dialog.open(MatricularEstudiantesCarreraComponent, {
      height: '90%',
      width: '90%',
      data: { idCarrera: this.idCarreras },
    });
  }

  obtenerUsuarios(): void {
    this.careerUsers = this.carrerasService
      .matriculadosObtener(this.idCarreras)
      .valueChanges()
      .subscribe((users) => {
        this.getUserInfo(users);
      });
  }

  getUserInfo(users: any): void {
    users.forEach(user => {
      const userInfo = this.userService.detailUser(user.id)
      .valueChanges()
      .subscribe(u => {
        user.correo = u.correo;
        user.eliminado = u.eliminado ? true : false;
        this.dataSource.data = users.filter(x => !x.eliminado);
        userInfo.unsubscribe();
      });
    });
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
      this.carrerasService.desmatricularUsuario(element.id, this.idCarreras)
        .then(() => {
          this.mensajeError(
            `${element.nombre} desmatriculado de la carrera, pero hubo error en algunos cursos individuales, debe validar en los cursos.`
          );
        })
        .catch((err) => {
          this.mensajeError(
            `${element.nombre} no se pudo desmatricular, intentelo otra vez. ${{err}}`
          );
        });
      
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

  allowOrDenyCert(element): void {
    if (!element.bloquearCert) {
      Swal.fire({
        title: '¿Esta seguro?',
        text: `Esta acción bloqueara la descarga del certificado para este estudiante. ¿Esta seguro?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro!',
      })
      .then((result) => {
        if (result) {
          this.carrerasService.allowOrDenyCert(this.idCarreras, element.id, true)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Exito!',
              text: `Certificado bloqueado exitosamente.`,
              confirmButtonText: 'cerrar',
            });
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
    } else {
      Swal.fire({
        title: '¿Esta seguro?',
        text: `Esta acción habilitara nuevamente la descarga del certificado para este estudiante. ¿Esta seguro?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro!',
      })
      .then((result) => {
        if (result) {
          this.carrerasService.allowOrDenyCert(this.idCarreras, element.id, false)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Exito!',
              text: `Certificado habilitado exitosamente.`,
              confirmButtonText: 'cerrar',
            });
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
    }
  }
}
