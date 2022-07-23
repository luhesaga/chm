import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MailService } from 'src/app/core/services/mail/mail.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CarrerasService } from '../../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-create-ads-curso',
  templateUrl: './create-ads-curso.component.html',
  styleUrls: ['./create-ads-curso.component.scss'],
})
export class CreateAdsCursoComponent implements OnInit {
  contenido: any;
  opciones: any;
  idCurso: string;
  matriculados: any[];
  estudiantesSeleccionados: any[];
  usuarioEnSeccion: any;
  courseName: string;

  careerId: string;
  careerView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private careerService: CarrerasService,
    private fireStore: AngularFirestore,
    private userService: UsersService,
    private mailService: MailService,
    private auth: AuthService,
    private route: Router
  ) {
    this.estudiantesSeleccionados = [];
    this.matriculados = [];
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    this.contenido = {
      descripcion: '',
      titulo: '',
    };
    this.opciones = {
      todoCurso: false,
      estudiantesSeleccionados: false,
      miCopia: false,
    };
  }

  ngOnInit(): void {
    this.getlogguedUser();
    this.obtenerIdMatriculados();
    this.getCourse();
  }

  getlogguedUser(): void {
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
        matriculados.forEach((usuario: any) => {
          const user = this.datosUsuario(usuario)
            .subscribe(u => {
              usuario.eliminado = u.eliminado ? true : false;
              usuario.correo = u.correo;
              user.unsubscribe();
            });
        });
        this.matriculados = matriculados;
        // console.log(this.matriculados);
      },
        () => this.mensajeErrorIdMatriculados()
      );
    } else {
      this.careerService.matriculadosObtener(this.careerId)
        .valueChanges()
        .subscribe((matriculados) => {
          matriculados.forEach((usuario: any) => {
            const user = this.datosUsuario(usuario)
              .subscribe(u => {
                usuario.eliminado = u.eliminado ? true : false;
                usuario.correo = u.correo;
                user.unsubscribe();
              });
          });
          this.matriculados = matriculados;
        },
          () => this.mensajeErrorIdMatriculados()
        );
    }
  }

  datosUsuario(usuario: any): any {
    return this.userService.detailUser(usuario.id).valueChanges();
  }

  mensajeErrorIdMatriculados(): void {
    Swal.fire({
      icon: 'error',
      title: 'Hay un error de conexión',
      text: 'Por favor recargue la página',
    });
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
      const career = this.careerService.obtenerCarrera(this.careerId)
        .valueChanges()
        .subscribe((c: any) => {
          this.courseName = c.nombre;
          career.unsubscribe();
        });
    }
  }

  crearAnuncio(): void {
    const id = this.careerView ? this.careerId : this.idCurso;
    const idAnuncio = this.fireStore.createId();
    this.courseService
      .createAnuncio(this.contenido, id, idAnuncio)
      .then(
        () => this.opcionesElegidas(idAnuncio),
        () => this.mensajeErrorCrearAnuncio()
      );
  }

  async opcionesElegidas(idAnuncio: string): Promise<void> {
    if (this.opciones.todoCurso) {
      await this.obtenerUsuariosMatriculados(idAnuncio);
      const activos = this.matriculados.filter(x => !x.eliminado);
      this.enviarEmailEstudiantes(activos);
    } else if (this.opciones.estudiantesSeleccionados) {
      await this.obtenerUsuarioSeleccionados(idAnuncio);
      this.enviarEmailEstudiantes(this.estudiantesSeleccionados);
    }
    if (this.opciones.miCopia) {
      this.enviarmeEmail();
    }
    this.mensajeAnuncioCreado();
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

  async obtenerUsuariosMatriculados(idAnuncio: string): Promise<void> {
    if (this.matriculados) {
      const data = {
        titulo: this.contenido.titulo,
        idAnuncios: idAnuncio,
      };
      const activos = this.matriculados.filter(x => !x.elimiando);
      for (let i = 0; activos.length > i; ++i) {
        await this.userService
          .agregarAnuncios(data, activos[i].id, idAnuncio)
          .then(() => '');
      }
    }
  }

  async obtenerUsuarioSeleccionados(idAnuncio: string): Promise<void> {
    if (this.estudiantesSeleccionados.length > 0) {
      const data = {
        titulo: this.contenido.titulo,
        idAnuncios: idAnuncio,
      };
      for (let i = 0; this.estudiantesSeleccionados.length > i; ++i) {
        await this.userService
          .agregarAnuncios(data, this.estudiantesSeleccionados[i].id, idAnuncio)
          .then(() => '');
      }
    }
  }

  enviarEmailEstudiantes(estudiantes: any[]): void {
    estudiantes.forEach((estudiante) => {
      const unsuscribeUser = this.userService
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
          unsuscribeUser.unsubscribe();
        });
    });
  }

  mensajeAnuncioCreado(): void {
    Swal.fire({
      title: 'Anuncio creado exitosamente',
      icon: 'success',
    }).then(() => this.volverAListaAnuncio());
  }

  mensajeErrorCrearAnuncio(): void {
    Swal.fire({
      title: 'Anuncio no pude ser creado',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: 'red',
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
        title: 'Creando el anuncio',
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.crearAnuncio();
    }
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
}
