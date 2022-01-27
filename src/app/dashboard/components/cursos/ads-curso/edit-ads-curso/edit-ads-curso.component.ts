import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MailService } from 'src/app/core/services/mail/mail.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CarrerasService } from '../../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-edit-ads-curso',
  templateUrl: './edit-ads-curso.component.html',
  styleUrls: ['./edit-ads-curso.component.scss'],
})
export class EditAdsCursoComponent implements OnInit {
  contenido: any;
  opciones: any;
  idCurso: string;
  idAnuncio: string;
  matriculados: any[];
  estudiantesSeleccionados: any[];
  usuarioEnSeccion: any;
  dateUpdate = false;
  courseName: string;
  careerId: string;
  careerView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private careerService: CarrerasService,
    private userService: UsersService,
    private mailService: MailService,
    private auth: AuthService,
    private route: Router
  ) {
    this.contenido = {};
    this.opciones = {
      todoCurso: false,
      estudiantesSeleccionados: false,
      miCopia: false,
    };
    this.getLogguedUser();
    this.estudiantesSeleccionados = [];
    this.matriculados = [];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idAnuncio = this.activatedRoute.snapshot.params.idAnuncio;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
  }

  ngOnInit(): void {
    this.obtenerIdMatriculados();
    this.obtenerAnuncio();
    this.getCourse();
  }

  getCourse(): void {
    if (!this.careerView) {
      const course = this.courseService
        .detailCourse(this.idCurso)
        .valueChanges()
        .subscribe((c) => {
          this.courseName = c.nombre;
          course.unsubscribe();
        });
    } else {
      const career = this.careerService
        .obtenerCarrera(this.careerId)
        .valueChanges()
        .subscribe((c: any) => {
          this.courseName = c.nombre;
          career.unsubscribe();
        });
    }
  }

  obtenerAnuncio(): void {
    const id = this.careerView ? this.careerId : this.idCurso;
    this.courseService
      .obtenerAnuncio(id, this.idAnuncio)
      .valueChanges()
      .subscribe((anuncio) => {
        if (anuncio) {
          this.contenido = anuncio;
        } else {
          this.mensajeAnuncioEliminado();
        }
      });
  }

  mensajeAnuncioEliminado(): void {
    Swal.fire({
      title: 'El anuncio ha sido eliminado',
      icon: 'error',
      confirmButtonText: 'volver',
    }).then(() => this.volverAListaAnuncio());
  }

  getLogguedUser(): void {
    this.auth.user$.subscribe(
      (usuario) => (this.usuarioEnSeccion = usuario),
      () => this.mensajeErrorIdMatriculados()
    );
  }

  obtenerIdMatriculados(): void {
    if (!this.careerView) {
      this.courseService
      .getRegisteredUSers(this.idCurso)
      .valueChanges()
      .subscribe((matriculados) => {
        this.matriculados = matriculados;
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

  validarContenidoAnuncio(): void {
    const titulo: string = this.contenido.titulo;
    const descripcion: string = this.contenido.descripcion;
    if (
      this.validarTituloAnuncio(titulo) &&
      this.validarDescripcionAnuncio(descripcion)
    ) {
      Swal.fire({
        confirmButtonColor: '#005691',
        title: 'Editando el anuncio',
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.editarAnuncio();
    }
  }

  editarAnuncio(): void {
    const id = this.careerView ? this.careerId : this.idCurso;
    this.courseService
      .editarAnuncio(
        this.contenido,
        id,
        this.idAnuncio,
        this.dateUpdate,
        this.contenido.fecha
      )
      .then(
        () => this.opcionesElegidas(),
        () => this.mensajeErrorEditarAnuncio()
      );
  }

  opcionesElegidas(): void {
    if (this.opciones.todoCurso) {
      this.obtenerAnuncioEstudiante();
      this.enviarEmailEstudiantes(this.matriculados);
    } else if (this.opciones.estudiantesSeleccionados) {
      this.obtenerUsuarioSeleccionados();
      this.enviarEmailEstudiantes(this.estudiantesSeleccionados);
    }
    if (this.opciones.miCopia) {
      this.enviarmeEmail();
    }
    this.mensajeAnuncioEditado();
  }

  enviarmeEmail(): void {
    const data = {
      to: this.usuarioEnSeccion.correo,
      titulo: this.contenido.titulo,
      contenido: this.contenido.descripcion,
      curso: this.courseName,
    };
    // console.log(data);
    const unsubscribe = this.mailService.sendEmailAnuncioCurso(data).subscribe(
      () => unsubscribe.unsubscribe(),
      (e) => {
        console.log(e);
      }
    );
  }

  obtenerUsuarioSeleccionados(): void {
    if (this.estudiantesSeleccionados.length > 0) {
      this.estudiantesSeleccionados.forEach((seleccionado) => {
        const unsubscribe = this.userService
          .obtenerAnuncioEstudiante(seleccionado.id, this.idAnuncio)
          .valueChanges()
          .subscribe(
            (anuncio) => {
              if (anuncio) {
                this.editarAnuncioEstudainte(seleccionado.id);
              } else {
                this.agregarAnuncioEstudiante(seleccionado.id);
              }
              unsubscribe.unsubscribe();
            },
            () => this.mensajeErrorNotficarEstudiantes()
          );
      });
    }
  }

  obtenerAnuncioEstudiante(): void {
    if (this.matriculados) {
      this.matriculados.forEach((matriculado) => {
        const unsubscribe = this.userService
          .obtenerAnuncioEstudiante(matriculado.id, this.idAnuncio)
          .valueChanges()
          .subscribe(
            (anuncio) => {
              if (anuncio) {
                this.editarAnuncioEstudainte(matriculado.id);
              } else {
                this.agregarAnuncioEstudiante(matriculado.id);
              }
              unsubscribe.unsubscribe();
            },
            () => this.mensajeErrorNotficarEstudiantes()
          );
      });
    }
  }

  agregarAnuncioEstudiante(idEstudiante: string): void {
    const data = {
      titulo: this.contenido.titulo,
      idAnuncios: this.idAnuncio,
    };
    this.userService.agregarAnuncios(data, idEstudiante, this.idAnuncio).then(
      () => {},
      () => this.mensajeErrorNotficarEstudiantes()
    );
  }

  async editarAnuncioEstudainte(idEstudiante: string): Promise<void> {
    this.userService
      .editarAnuncios(this.contenido, idEstudiante, this.idAnuncio)
      .then(
        () => {},
        () => this.mensajeErrorNotficarEstudiantes()
      );
  }

  enviarEmailEstudiantes(estudiantes: any[]): void {
    estudiantes.forEach((estudiante) => {
      const unsubscribeUser = this.userService
        .detailUser(estudiante.id)
        .valueChanges()
        .subscribe((estudianteMail: any) => {
          const data = {
            to: estudianteMail.correo,
            titulo: this.contenido.titulo,
            contenido: this.contenido.descripcion,
            curso: this.courseName,
          };
          // console.log(data);
          const unsubscribe = this.mailService
            .sendEmailAnuncioCurso(data)
            .subscribe(
              () => unsubscribe.unsubscribe(),
              (e) => {
                console.log(e);
              }
            );
          unsubscribeUser.unsubscribe();
        });
    });
  }

  mensajeErrorEditarAnuncio(): void {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo editar el anuncio',
      text: 'Por favor intente otra vez editar el anuncio',
      confirmButtonText: 'Aceptar',
    });
  }

  mensajeErrorNotficarEstudiantes(): void {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo notificar todos los estudiantes',
      text: 'Por favor intente otra vez editar el anuncio',
      confirmButtonText: 'Aceptar',
    });
  }

  validarTituloAnuncio(titulo: string): boolean {
    if (titulo.length < 3) {
      Swal.fire({
        title: 'Titulo del anuncio',
        text: 'El titulo del anuncio debe tener mas de 3 caracteres',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
      return false;
    } else {
      return true;
    }
  }

  validarDescripcionAnuncio(descripcion: string): boolean {
    if (descripcion === '') {
      Swal.fire({
        title: 'Descripción del anuncio',
        text: 'La descripción del anuncio no debe estar vacío',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
      return false;
    } else {
      return true;
    }
  }

  seleccionarEstudiantes(matriculado: any, elegido: boolean): void {
    if (elegido) {
      this.estudiantesSeleccionados.push(matriculado);
    } else {
      const posicion = this.estudiantesSeleccionados.findIndex(
        (estudiante) => estudiante.id === matriculado.id
      );
      this.estudiantesSeleccionados.splice(posicion, 1);
    }
  }

  volverAListaAnuncio(): void {
    if (!this.careerView) {
      this.route.navigate([`/cursos/anuncios/${this.idCurso}`]);
    } else {
      this.route.navigate([`/carreras/anuncios/${this.careerId}`]);
    }
  }

  mensajeAnuncioEditado(): void {
    Swal.fire({
      title: 'Anuncio editado exitosamente',
      icon: 'success',
    }).then(() => this.volverAListaAnuncio());
  }
}
