import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from './course-info/course-info.component';
import { CourseService } from '../../../core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  cursos;
  userId;
  dashboard = false;
  coursesReceived;

  constructor(
    public dialog: MatDialog,
    public courseService: CourseService,
    private catService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.userId = this.activatedRoute.snapshot.params.userId;
    if (this.userId) {
      this.dashboard = true;
    }
  }

  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy(): void {
    this.coursesReceived.unsubscribe();
  }

  getCourses() {
    this.coursesReceived = this.courseService
      .listCourses()
      .valueChanges()
      .subscribe((courses) => {
        this.getCourseCategory(courses);
        //this.cursos = this.estrellasCourses(courses);
        this.getUsersRating(courses);
      });
  }

  getCourseCategory(courses) {
    courses.forEach((c) => {
      let category = this.catService
        .detailCategory(c.categoria)
        .valueChanges()
        .subscribe((cat) => {
          c.categoria = cat.nombre;
          category.unsubscribe();
        });
    });
  }

  getUsersRating(courses) {
    courses.forEach((c) => {
      c.promedio = c.estrellas
        ? Number.parseFloat((c.estrellas / c.votos).toString()).toFixed(1)
        : '0';
      let userRating = this.courseService.getUserStars(this.userId, c.id)
        .valueChanges()
        .subscribe(u => {
          if (u) {
            c.haVotado = true;
          } else {
            c.haVotado = false;
          }
          userRating.unsubscribe();
        });
    });
    this.cursos = courses;
  }

  openDialog(data): void {
    const config = {
      data: {
        message: 'informacion del curso',
        content: data,
      },
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result ${result}`);
    });
  }

  goToCourseDetail(courseId) {
    if (this.dashboard) {
      this.route.navigate([
        `/dashboard/cursos/detalle/${courseId}/${this.userId}`,
      ]);
    } else {
      this.route.navigate([`/home/detalle-curso/${courseId}`]);
    }
  }

  agregarEstrella(calificacion: number, item: any) {
    const data = {
      idCurso: item.id,
      calificacion,
      idUsuario: this.userId,
      estrellasAcum: item.estrellas
        ? item.estrellas + calificacion
        : calificacion,
      votosAcum: item.votos ? item.votos + 1 : 1,
    };
    //console.log(item);
    //console.log(data);
    this.courseService
      .setStarsAndVotes(data)
      .then(() => {
        this.courseService.agregarEstrella(data).then(() => {
          if (calificacion > 1) {
            this.successSwal(
              `Gracias por su calificación de ${calificacion} estrellas`,
              ''
            );
          } else {
            this.successSwal(
              `Gracias por su calificación de ${calificacion} estrella`,
              ''
            );
          }
        }),
          (e) => {
            this.errorsSwal(
              'No se pudo calificar el curso.',
              'Por favor intentelo mas tarde'
            );
            console.log(e);
          };
      })
      .catch((err) => console.log(err));
  }

  bloquearVotoAlCurso(item: any) {
    const indexCurso: number = this.cursos.findIndex(
      (curso) => curso.id === item.id
    );
    this.cursos[indexCurso].haVotado = true;
  }

  successSwal(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
    });
  }

  errorsSwal(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'Cerrar',
    });
  }
}
