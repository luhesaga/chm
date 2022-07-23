import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import Swal from 'sweetalert2';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  user;
  cursosUsuario = [];
  carrerasUsuario = [];

  constructor(
    public dialog: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursosServicio: CourseService,
    private carrerasServicio: CarrerasService,
    private usuarios: UsersService
  ) {
    this.user = {
      id: this.data.content.id,
      nombres: this.data.content.nombres,
      apellidos: this.data.content.apellidos,
      correo: this.data.content.correo,
      perfil: this.data.content.perfil,
      eliminado: this.data.content.eliminado === true ? true : false
    };
    // console.log(this.data.content);
  }

  ngOnInit(): void {
    this.obtenerCursos();
    this.obtenerCarreras();
  }

  obtenerCursos(): void {
    const cursosUsuario = this.cursosServicio
      .listCourses()
      .valueChanges()
      .subscribe((cursos) => {
        cursos.forEach((curso: any) => {
          const validar = this.obtenerCursosUsuario(curso).subscribe((v) => {
            if (v) {
              const fechaFin = v.fechaFinalizacionMatricula;
              const cursoUsuario = {
                nombre: curso.nombre,
                fechaFinMatricula:
                  fechaFin !== 'nunca'
                    ? new Date(
                        v.fechaFinalizacionMatricula.seconds * 1000
                      ).toLocaleDateString()
                    : 'ilimitado',
                fechaMatricula: new Date(
                  v.fechaMatricula.seconds * 1000
                ).toLocaleDateString(),
                finalizado: v.finalizado ? 'Finalizado' : 'En curso',
              };
              this.cursosUsuario.push(cursoUsuario);
            }
            validar.unsubscribe();
          });
        });
        // console.log(this.cursosUsuario);
        cursosUsuario.unsubscribe();
      });
  }

  obtenerCursosUsuario(curso): any {
    return this.cursosServicio
      .listCoursesByUser(curso.id, this.user.id)
      .valueChanges();
  }

  obtenerCarreras(): void {
    const carrerasUsuario = this.carrerasServicio.obtenerCarreras()
      .valueChanges()
      .subscribe(carreras => {
        carreras.forEach(carrera => {
          const validar = this.obtenerCarrerasUsuario(carrera)
            .subscribe(v => {
              if (v) {
                const fechaFin = v.fechaFinalizacionMatricula;
                const carreraUsuario = {
                  nombre: carrera.nombre,
                  fechaFinMatricula:
                    fechaFin !== 'nunca'
                      ? new Date(
                          v.fechaFinalizacionMatricula.seconds * 1000
                        ).toLocaleDateString()
                      : 'ilimitado',
                  fechaMatricula: new Date(
                    v.fechaMatricula.seconds * 1000
                  ).toLocaleDateString(),
                };
                this.carrerasUsuario.push(carreraUsuario);
              }
              validar.unsubscribe();
            });
        });
        // console.log(this.carrerasUsuario);
        carrerasUsuario.unsubscribe();
      });
  }

  obtenerCarrerasUsuario(carrera): any {
    return this.carrerasServicio
      .getRegisteredUser(carrera.id, this.user.id)
      .valueChanges();
  }

  eliminarUsuario(): void {
    if (this.user.perfil !== 'administrador') {
      this.ActivarODesactivarUsuario();
    } else {
      Swal.fire('Error', 'No se puede dar de baja a un administardor.', 'error');
    }
  }

  ActivarODesactivarUsuario(): void {
    if (!this.user.eliminado) {
      Swal.fire({
        title: '¿Esta seguro?',
        text: 'El usuario sera marcado como inactivo y no podra ingresar a la plataforma.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        this.desactivarUsuario(result);
      });
    } else {
      Swal.fire({
        title: '¿Esta seguro?',
        text: 'El usuario sera marcado como activo y podra ingresar a la plataforma.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        this.activarUsuario(result);
      });
    }
  }

  desactivarUsuario(result: any): void {
    if (result.isConfirmed) {
      this.usuarios.actualizarEstado(this.user.id, true)
        .then(() => {
          Swal.fire(
            'Listo!',
            'Usuario dado de baja de la plataforma.',
            'success'
          );
          this.dialog.close();
        })
        .catch(error => console.log(error));
    }
  }

  activarUsuario(result: any): void {
    if (result.isConfirmed) {
      this.usuarios.actualizarEstado(this.user.id, false)
        .then(() => {
          Swal.fire(
            'Listo!',
            'Usuario activado satisfactoriamente.',
            'success'
          );
          this.dialog.close();
        })
        .catch(error => console.log(error));
    }
  }

}
