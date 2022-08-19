import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrerasService } from '../../../core/services/carreras/carreras.service';
import { CourseService } from '../../../core/services/courses/course.service';

@Component({
  selector: 'app-mycareers',
  templateUrl: './mycareers.component.html',
  styleUrls: ['./mycareers.component.scss'],
})
export class MycareersComponent implements OnInit {
  userId: string;
  userCareers: any;

  constructor(
    private careerService: CarrerasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService
  ) {
    this.userId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCareers();
  }

  getCareers(): void {
    const careersList = this.careerService
      .obtenerCarreras()
      .valueChanges()
      .subscribe((careers) => {
        this.getRegisteredUsers(careers);
        careersList.unsubscribe();
      });
  }

  getRegisteredUsers(careers): void {
    this.userCareers = [];
    careers.forEach((c) => {
      const userCareer = this.careerService
        .getRegisteredUser(c.id, this.userId)
        .valueChanges()
        .subscribe((uc: any) => {
          // console.log(uc);
          if (uc) {
            if (!this.vencimientoCarrera(c, uc.fechaFinalizacionMatricula)) {
              this.userCareers.push(this.setUserCareer(c, uc));
            }
          }
          userCareer.unsubscribe();
        });
    });
  }

  setUserCareer(careerData, userOpt): any  {
    const endDate =
      userOpt.fechaFinalizacionMatricula === 'nunca'
        ? 'nunca'
        : new Date(userOpt.fechaFinalizacionMatricula.seconds * 1000);

    return {
      id: careerData.id,
      nombre: careerData.nombre,
      imagen: careerData.image,
      fechaFin: endDate,
    };
  }

  vencimientoCarrera(career: any, endDate: any): boolean {
    let matriculaVencida = false;
    const hoy = new Date();

    if (endDate === 'nunca') {
      console.log('ilimitada.');
      matriculaVencida = false;
    } else {
      const fechaFinal = new Date(endDate.seconds * 1000);
      if (fechaFinal < hoy) {
        matriculaVencida = true;
        this.desmatricular(career);
      } else {
        console.log('fecha ok.');
        matriculaVencida = false;
      }
    }

    return matriculaVencida;
  }

  desmatricular(carrera: any): void {
    // primero obtener opciones de usuario en la carrera
    this.obtenerOpcionesUsuarioCarrera(carrera);
  }

  obtenerOpcionesUsuarioCarrera(carrera: any): void {
    const dataUsuario = this.careerService
      .getRegisteredUser(carrera.id, this.userId)
      .valueChanges()
      .subscribe((user) => {
        carrera.datosUsuario = user;
        // segundo obtener cursos de la carrera
        this.obtenerCursosCarrera(carrera);
        dataUsuario.unsubscribe();
      });
  }

  obtenerCursosCarrera(carrera: any): void {
    const cursosCarrera = this.careerService.getCareerCourses(carrera.id)
      .valueChanges()
      .subscribe(cursos => {
        // desmatricular de los cursos y dejando las configuraciones individuales
        carrera.cursosCarrera = cursos;
        this.desmatricularDeCursos(carrera);
        cursosCarrera.unsubscribe();
      });
  }

  desmatricularDeCursos(data: any): void {
    let error = false;
    let i = 0;
    const user = this.userId;
    const ultimaMatricula = data.datosUsuario.matriculaIndividual.length - 1;

    this.DesmatriculaDirectadeCursos(data);

    while (i <= ultimaMatricula && !error) {
      const matricula = data.datosUsuario.matriculaIndividual[i];
      error = this.actualizarMatriculaIndividual(matricula, user);
      i++;
    }

    this.desmatricularDeCarrera(data);

    // if (!error) {
    //   // desmatricular de la carrera
    //   this.desmatricularDeCarrera(data);
    // } else {
    //   console.log('error al desmatricular');
    // }
  }

  DesmatriculaDirectadeCursos(data: any): void {
    const cursosParaActualizar = data.datosUsuario.matriculaIndividual;
    const cursosDesmatriculaDirecta = data.cursosCarrera;
    cursosDesmatriculaDirecta.forEach(cursoD => {
      let borrar = true;
      cursosParaActualizar.forEach(cursoA => {
        if (cursoD.id === cursoA.cursoId) {
          borrar = false;
        }
      });
      if (borrar) {
        if (cursoD.tipo !== 'ejercicio') {
          this.courseService.deleteUserFromCourse(cursoD.id, this.userId)
          .then(() => console.log(`desmatriculado de: ${cursoD.nombre}`))
          .catch(
            (err) => console.log(`error al desmatricular de: ${cursoD.nombre} error: ${err}`)
          );
        }
      }
    });

  }

  actualizarMatriculaIndividual(matriculaIndividual: any, idEstudiante: string): boolean {
    let error;
    this.courseService
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

  desmatricularDeCarrera(data): void {
    const user = this.userId;
    const career = data.id;
    this.careerService.desmatricularUsuario(user, career)
      .then(() => console.log('desmatriculado de la carrera.'))
      .catch(err => console.log(`error al desmatricular: ${err}`));
  }

  fechaFinalizacionMatricula(valueNumber: number): Date {
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setMonth(fechaFinalizacion.getMonth() + valueNumber);
    return fechaFinalizacion;
  }

  goToCareersList(): void {
    this.router.navigate([`/dashboard/carreras/catalogo/${this.userId}`]);
  }

  goToCareerIndex(careerId): void {
    // this.router.navigate([`/dashboard/mis-carreras/cursos/${careerId}/${this.userId}`]);
    this.router.navigate([`dashboard/carreras/index/${careerId}/${'std'}`]);
  }
}
