import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { MailService } from 'src/app/core/services/mail/mail.service';

@Component({
  selector: 'app-matricular-estudiantes-carrera',
  templateUrl: './matricular-estudiantes-carrera.component.html',
  styleUrls: ['./matricular-estudiantes-carrera.component.scss'],
})
export class MatricularEstudiantesCarreraComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'nombre',
    'correo',
    'perfil',
    'estado',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  career: any;

  users = [];
  cursosCarrera: any[];
  unsubscribe: Subscription[];

  constructor(
    public dialogRef: MatDialogRef<MatricularEstudiantesCarreraComponent>,
    @Inject(MAT_DIALOG_DATA) public dataReceived: any,
    public carrerasService: CarrerasService,
    public userService: UsersService,
    public courseService: CourseService,
    private mailService: MailService
  ) {
    this.unsubscribe = [];
  }

  ngOnInit(): void {
    this.obtenerCursosCarrera();
    this.obtenerUsuarios();
    this.getCareerInfo();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
  }

  getCareerInfo(): void {
    const unsubscribe = this.carrerasService.obtenerCarrera(this.dataReceived.idCarrera)
      .valueChanges()
      .subscribe(c => {
        this.career = c;
        this.unsubscribe.push(unsubscribe);
      });
  }

  obtenerCursosCarrera(): void {
    const carreras = this.carrerasService
      .getCareerCourses(this.dataReceived.idCarrera)
      .valueChanges()
      .subscribe((cursos) => {
        this.cursosCarrera = cursos;
        carreras.unsubscribe();
      });
  }

  obtenerUsuarios(): void {
    const unsubscribe = this.userService
      .listUsers()
      .valueChanges()
      .subscribe((users) => {
        users.forEach(user => {
          if (!user.eliminado) {
            this.users.push(user);
          }
        });
        // this.users = users;
        this.obtenerMatriculados();
      });
    this.unsubscribe.push(unsubscribe);
  }

  obtenerMatriculados(): void {
    const unsubscribe = this.carrerasService
      .matriculadosObtener(this.dataReceived.idCarrera)
      .valueChanges()
      .subscribe((matriculados) => {
        this.obtenerDesmatriculados(matriculados);
      });
    this.unsubscribe.push(unsubscribe);
  }

  obtenerDesmatriculados(matriculados: any[]): any {
    const desmatriculados = this.users.filter((usuario) => {
      const encontrado = matriculados.findIndex(
        (matriculado) => usuario.id === matriculado.id
      );
      if (encontrado === -1) {
        usuario.estado = 'no matriculado';
        return true;
      } else {
        return false;
      }
    });
    this.datosDelArrayDeTabla(desmatriculados);
  }

  datosDelArrayDeTabla(desmatriculados: any[]): void {
    this.dataSource.data = desmatriculados;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  inputMesesMatricula(
    element: any,
    tipoMatricula: string,
    mesMatricula?: number
  ): void {
    Swal.fire({
      title: 'Meses',
      input: 'number',
      inputLabel:
        'Ingrese los meses de matricula. Solo puede matricular maximo 12 meses',
      confirmButtonText: 'MATRICULAR',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          const valueNumber = Number(value);
          if (valueNumber <= 0) {
            resolve('Los meses de matricula deben ser mayor a cero');
          } else if (valueNumber > 12) {
            resolve('Los meses de matricula deben ser menor a doce');
          } else {
            resolve('');
          }
        });
      },
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.usuarioMatriculaCursoIndividual(
          element,
          tipoMatricula,
          Number(confirm.value)
        );
      }
    });
  }

  usuarioMatriculaCursoIndividual(
    element: any,
    tipoMatricula: string,
    mesMatricula?: number
  ): void {
    this.mensajeMatriculandoEstudiante(
      `${element.nombres} ${element.apellidos}`
    );
    element.matriculaIndividual = [];
    element.cursosNoMatriculados = [];
    const ultimoCursosCarrera = this.cursosCarrera.length;
    this.cursosCarrera.forEach((curso, index) => {
      const usuarioCurso = this.courseService
        .listCoursesByUser(curso.id, element.id)
        .valueChanges()
        .subscribe(
          (usuario) => {
            if (usuario) {
              const data = {
                tipoMatricula: usuario.tipoMatricula,
                fechaFinalizacionMatricula: usuario.fechaFinalizacionMatricula,
                fechaMatricula: usuario.fechaMatricula,
                cursoId: curso.id,
              };
              element.matriculaIndividual.push(data);
            } else {
              element.cursosNoMatriculados.push(curso);
            }
            const numeroUsuarios =
              element.matriculaIndividual.length +
              element.cursosNoMatriculados.length;
            if (numeroUsuarios === ultimoCursosCarrera) {
              const matricula = this.tipoMatricula(tipoMatricula, mesMatricula);
              element.fechaMatricula = matricula.fechaMatricula;
              element.fechaFinalizacionMatricula =
                matricula.fechaFinalizacionMatricula;
              element.tipoMatricula = matricula.tipoMatricula;
              this.matricularEstudiante(element);
            }
            usuarioCurso.unsubscribe();
          },
          () =>
            this.mensajeError(
              `error al buscar los cursos de ${element.nombres} ${element.apellidos}`
            )
        );
    });
  }

  tipoMatricula(tipoMatricula: string, mesMatricula?: number): any {
    if (tipoMatricula === 'indefinida') {
      return {
        fechaMatricula: new Date(),
        fechaFinalizacionMatricula: 'nunca',
        tipoMatricula: 'indefinida',
      };
    } else {
      const fechaFinalizacionMatricula = new Date();
      fechaFinalizacionMatricula.setMonth(
        fechaFinalizacionMatricula.getMonth() + mesMatricula
      );
      return {
        fechaMatricula: new Date(),
        fechaFinalizacionMatricula,
        tipoMatricula: 'mes',
      };
    }
  }

  matricularEstudiante(element: any): void {
    this.carrerasService
      .matricularUsuario(element, this.dataReceived.idCarrera)
      .then(
        () => {
          this.matricularAlosQueNoEstanEnLosCursosDeCarrera(element);
        },
        () =>
          this.mensajeError(
            'No se pudo matricular al usuario, por favor intente otra vez'
          )
      )
      .catch(() => {
        this.mensajeError(
          'No se pudo matricular al usuario, por favor intente otra vez'
        );
      });
  }

  matricularAlosQueNoEstanEnLosCursosDeCarrera(element: any): void {
    element.stdName = `${element.nombres} ${element.apellidos}`;
    const ultimoCurso = element.cursosNoMatriculados.length - 1;
    if (ultimoCurso !== -1) {
      element.cursosNoMatriculados.forEach(async (curso: any, index) => {
        await this.courseService
          .registerUserToCourse(element, curso.id, element.id)
          .then(
            () => {
              if (ultimoCurso === index) {
                this.cambiarEstadoMatriculaDeEstudiantesCursos(element);
              }
            },
            () => {
              this.mensajeError(
                `No se pudo matricular en el curso ${curso.nombre}`
              );
            }
          )
          .catch(() => {
            this.mensajeError(
              `No se pudo matricular en el curso ${curso.nombre}`
            );
          });
      });
    } else {
      this.cambiarEstadoMatriculaDeEstudiantesCursos(element);
    }
  }

  cambiarEstadoMatriculaDeEstudiantesCursos(element: any): void {
    const ultimoCurso = element.matriculaIndividual.length - 1;
    element.matriculaIndividual.forEach(async (curso: any, index) => {
      if (
        curso.tipoMatricula === 'mes' &&
        element.tipoMatricula === 'indefinida'
      ) {
        await this.courseService
          .updateUserOfCourse(element, curso.cursoId, element.id)
          .then(
            () => {},
            () => {
              this.mensajeError(
                `No se pudo actualizar la matricula de ${element.stdName}`
              );
            }
          )
          .catch(() => {
            this.mensajeError(
              `No se pudo actualizar la matricula de ${element.stdName}`
            );
          });
      } else if (
        curso.tipoMatricula === 'mes' &&
        element.tipoMatricula === 'mes'
      ) {
        if (
          element.fechaFinalizacionMatricula >
          curso.fechaFinalizacionMatricula.toDate()
        ) {
          await this.courseService
            .updateUserOfCourse(element, curso.cursoId, element.id)
            .then(
              () => {},
              () => {
                this.mensajeError(
                  `No se pudo actualizar la matricula de ${element.stdName}`
                );
              }
            )
            .catch(() => {
              this.mensajeError(
                `No se pudo actualizar la matricula de ${element.stdName}`
              );
            });
        }
      }
      if (ultimoCurso === index || ultimoCurso === -1) {
        this.mensajeExito(`${element.stdName} matriculado exitosamente`);
        this.sendEmailMassive(element);
      }
    });
  }

  mensajeExito(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      text: mensaje,
      confirmButtonText: 'Aceptar',
    });
  }

  obtenerCursosDeCarrera(user: any): void {
    const carreraService = this.carrerasService
      .getCareerCourses(this.dataReceived.idCarrera)
      .valueChanges()
      .subscribe((cursos) => {
        carreraService.unsubscribe();
      });
  }

  mensajeError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      text: mensaje,
      confirmButtonText: 'Cerrar',
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mensajeMatriculandoEstudiante(nombre: string): void {
    Swal.fire({
      title: `Matriculando al estudiante ${nombre}`,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  async sendEmailMassive(estudiante): Promise<void> {
    const data = {
      nombre: estudiante.nombres,
      correo: estudiante.correo,
      curso: this.career.nombre,
    };
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data));
    await this.mailService
      .careerRegistration(data)
      .toPromise()
      .then(
        () => {
          console.log(`registrado ${estudiante.nombres}`);
        },
        (e) => {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: 'Correo no enviado',
            text: `El correo de confirmación no pudo ser enviado a usuario ${estudiante.nombres}.`,
            confirmButtonText: 'cerrar',
          });
        }
      );
  }
}
