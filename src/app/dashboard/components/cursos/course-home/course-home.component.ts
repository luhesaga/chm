import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from 'src/app/home/components/courses/course-info/course-info.component';
import Swal from 'sweetalert2';
import { LogsService } from 'src/app/core/services/logs/logs.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.component.html',
  styleUrls: ['./course-home.component.scss'],
})
export class CourseHomeComponent implements OnInit, OnDestroy {
  courseId: string;
  ReceivedCourse;

  stdId;
  admin = true;

  nombreCurso;
  categoria;
  descrDiv;
  descripcion;

  // opciones
  descriptionOpt = true;
  documentsOpt = true;
  lessonsOpt = true;
  exercisesOpt = true;
  evaluationsOpt = true;
  adsOpt = true;
  libraryOpt = true;
  glossaryOpt = true;
  meetOpt = true;
  forumOpt = true;
  chatOpt = true;

  isMobile = false;

  videoWidth;
  videoHeight;
  videoIframe;

  imgWidth;
  imgHeight;
  imgFrame;

  curso;

  careerId: string;
  carrera = false;
  std = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private catService: CategoryService,
    private careerService: CarrerasService,
    private logs: LogsService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private route: Router,
    private userService: UsersService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.id;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    // console.log(`curso: ${this.courseId} carrera: ${this.careerId} estudiante: ${this.stdId}`);

    if (this.stdId) {
      this.admin = false;
      this.setCourseLog();
      //this.getUserInfo(); pendiente para definir perfil de usuario
    }

    if (this.careerId) {
      this.carrera = true;
      if (this.activatedRoute.snapshot.params.std) {
        this.std = true;
      }
    }

    this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (!result.matches) {
          this.isMobile = true;
          // tamaño mobile de video o img
          if (this.videoIframe) {
            this.videoIframe.style.width = '280px';
            this.videoIframe.style.height = '140px';
            console.log(this.videoIframe.style.height);
          }
          if (this.imgFrame) {
            this.setImgSizeToMobile(this.imgFrame);
          }
        } else {
          // tamaño normal del video o img
          this.isMobile = false;
          if (this.videoIframe) {
            this.videoIframe.style.width = this.videoWidth;
            this.videoIframe.style.height = this.videoHeight;
            // console.log(this.videoIframe.style.height)
          }

          if (this.imgFrame) {
            this.setImgSizeToNormal(this.imgFrame);
          }
        }
      });
  }

  ngOnInit(): void {
    // console.info(this.id);
    this.getCourse();
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    if (this.ReceivedCourse) {
      this.ReceivedCourse.unsubscribe();
    }
  }

  getUserInfo(): void {
    const userInfo = this.userService.detailUser(this.stdId)
      .valueChanges()
      .subscribe(user => {
        console.log(user);
        userInfo.unsubscribe();
      });
  }

  setCourseLog(): void {
    const data = {
      curso: this.courseId,
      estudiante: this.stdId,
      fechaIngreso: new Date(),
    };
    this.logs.courseInLog(data);
  }

  getCourse(): void {
    this.ReceivedCourse = this.courseService
      .detailCourse(this.courseId)
      .valueChanges()
      .subscribe((curso) => {
        if (!this.careerId) {
          this.validateCareerCourse(curso);
        }
        this.catService
          .detailCategory(curso.categoria)
          .valueChanges()
          .subscribe((cat) => {
            this.loadData(curso, cat);
            this.curso = curso;
            this.getCourseOptions(curso);
          });
      });
  }

  validateCareerCourse(course: any): void {
    const careerList = this.careerService
      .obtenerCarreras()
      .valueChanges()
      .subscribe((careers) => {
        careers.forEach((career) => {
          this.courseValidation(course, career);
        });
        careerList.unsubscribe();
      });
  }

  courseValidation(course, career): void {
    const careerCourse = this.careerService
      .validateCareerCourse(career.id, course.id)
      .valueChanges()
      .subscribe((courses) => {
        if (courses.length > 0) {
          this.userValidation(career);
        }
        careerCourse.unsubscribe();
      });
  }

  userValidation(career): void {
    const validation = localStorage.getItem('carreraCurso');
    const registeredUser = this.careerService
      .getRegisteredUser(career.id, this.stdId)
      .valueChanges()
      .subscribe((user) => {
        if (user) {
          if (validation === 'no') {
            Swal.fire({
              icon: 'warning',
              title: 'Curso de carrera',
              text: `Este curso hace parte de la carrera 
                    ${career.nombre} en la que estas inscrito, 
                    para la mejor experiencia de aprendizaje 
                    te recomendamos seguir el orden de los cursos.`,
              confirmButtonText: 'Entendido',
            });
            localStorage.setItem('carreraCurso', 'si');
          } else {
            console.log('mensaje ya mostrado.');
          }
        }
        registeredUser.unsubscribe();
      });
  }

  getCourseOptions(course): void {
    let opt;
    if (course.opciones) {
      opt = course.opciones;

      this.descriptionOpt = opt.descripcion ? opt.descripcion : false;
      this.documentsOpt = opt.documentos ? opt.documentos : false;
      this.lessonsOpt = opt.lecciones ? opt.lecciones : false;
      this.exercisesOpt = opt.ejercicios ? opt.ejercicios : false;
      this.evaluationsOpt = opt.evaluaciones ? opt.evaluaciones : false;
      this.adsOpt = opt.anuncios ? opt.anuncios : false;
      this.libraryOpt = opt.biblioteca ? opt.biblioteca : false;
      this.glossaryOpt = opt.glosario ? opt.glosario : false;
      this.meetOpt = opt.videoconferencia ? opt.videoconferencia : false;
      this.forumOpt = opt.foros ? opt.foros : false;
      this.chatOpt = opt.chat ? opt.chat : false;
    }
  }

  goToLessons(): void {
    if (this.admin && !this.carrera) {
      this.route.navigate([`cursos/lecciones/${this.courseId}`]);
    } else if (!this.admin && this.carrera && !this.std) {
      this.route.navigate([
        `cursos/lecciones-carrera/${this.careerId}/${this.stdId}/${this.courseId}`,
      ]);
    } else if (this.carrera && this.std) {
      this.route.navigate([
        `mis-cursos/lecciones-carrera/${this.careerId}/${this.courseId}/${this.stdId}`,
      ]);
    } else {
      this.route.navigate([
        `mis-cursos/lecciones/${this.courseId}/${this.stdId}`,
      ]);
    }
  }

  goToExercises(): void {
    this.route.navigate([`cursos/ejercicios/${this.courseId}`]);
  }

  goToGlossary(): void {
    if (this.admin) {
      this.route.navigate([`cursos/glosario/${this.courseId}`]);
    } else {
      this.route.navigate([`cursos/glosario/${this.courseId}/${this.stdId}`]);
    }
  }

  goToVideo(): void {
    if (this.admin) {
      this.route.navigate([`cursos/video-meet/${this.courseId}`]);
    } else {
      this.route.navigate([`cursos/video-meet/${this.courseId}/${this.stdId}`]);
    }
  }

  goToDocuments(): void {
    if (this.admin) {
      this.route.navigate([`documents/${this.courseId}`]);
    } else {
      this.route.navigate([`documents/${this.courseId}/${this.stdId}`]);
    }
  }

  goToEvaluations(): void {
    if (this.admin) {
      this.route.navigate([`cursos/evaluaciones/${this.courseId}`]);
    } else {
      this.route.navigate([
        `cursos/evaluaciones/estudiante/${this.courseId}/${this.stdId}`,
      ]);
    }
    if (this.admin && !this.carrera) {
      this.route.navigate([`cursos/evaluaciones/${this.courseId}`]);
    } else if (!this.admin && this.carrera && !this.std) {
      this.route.navigate([
        `cursos/evaluaciones-carrera/${this.careerId}/${this.courseId}/${this.stdId}`,
      ]);
    } else if (this.carrera && this.std) {
      console.log(this.admin);
      console.log(this.carrera);
      console.log(this.std);
      this.route.navigate([
        `cursos/evaluaciones-carrera-std/${this.careerId}/${this.courseId}/${this.stdId}`,
      ]);
    } else {
      this.route.navigate([
        `cursos/evaluaciones/estudiante/${this.courseId}/${this.stdId}`,
      ]);
    }
  }

  goToForum(): void {
    if (this.admin) {
      this.route.navigate([`cursos/foros/revisar/${this.courseId}`]);
    } else {
      console.log('foros');
    }
  }

  goToChat(): void {
    if (!this.admin) {
      this.route.navigate([`cursos/chat-std/${this.courseId}/${this.stdId}`]);
    } else {
      this.route.navigate([`cursos/chat-adm/${this.courseId}`]);
    }
  }

  goBack(): void {
    console.log(this.admin);
    console.log(this.carrera);
    console.log(this.std);
    if (this.admin) {
      this.route.navigate(['dashboard/cursos']);
    } else if (this.carrera && !this.std) {
      this.route.navigate([
        `dashboard/mis-cursos-lecciones-carrera/${this.stdId}/${this.careerId}`,
      ]);
    } else if (this.carrera && this.std) {
      this.route.navigate([
        `dashboard/mis-cursos-lecciones-carrera/${this.stdId}/${
          this.careerId
        }/${'std'}`,
      ]);
    } else {
      this.route.navigate([`dashboard/mis-cursos/${this.stdId}`]);
    }
  }

  openDialog(): void {
    const config = {
      data: {
        message: 'informacion del curso',
        content: this.curso,
      },
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result ${result}`);
    });
  }

  loadData(curso, cat): void {
    this.nombreCurso = curso.nombre;
    this.categoria = cat.nombre;

    this.descrDiv = document.getElementById('descripcion');
    if (this.descrDiv) {
      this.descrDiv.innerHTML = curso.descripcion;
    }
    this.loadDescriptionVideoOrImg();
  }

  loadDescriptionVideoOrImg(): void {
    this.videoIframe = document.querySelector('iframe');
    if (this.videoIframe) {
      this.videoWidth = this.videoIframe.style.width;
      this.videoHeight = this.videoIframe.style.height;
      if (this.isMobile) {
        this.videoIframe.style.width = '280px';
        this.videoIframe.style.height = '140px';
        // console.log(this.videoIframe.style.height)
      } else {
        this.setFontSize();
      }
    }
    this.imgFrame = document.querySelector('p img');
    if (!this.imgFrame) {
      this.imgFrame = document.querySelector('p span img');
    }
    if (this.imgFrame) {
      this.setImgSizeToMobile(this.imgFrame);
    }
  }

  setImgSizeToMobile(img): void {
    // console.log(img);
    // this.imgWidth = img.getAttribute('width');
    // this.imgHeight = img.getAttribute('height');
    // const w = parseInt(img.getAttribute('width')) / 2;
    // const h = parseInt(img.getAttribute('height')) / 2;
    if (this.isMobile) {
      img.setAttribute('width', '70%');
      img.setAttribute('height', '70%');
    } // else {
    //   this.setFontSize();
    // }
  }

  setImgSizeToNormal(img): void {
    img.setAttribute('width', '80%');
    img.setAttribute('height', '80%');
  }

  setFontSize(): void {
    const parrafo = document.querySelector('p span');
    if (parrafo) {
      parrafo.setAttribute(
        'style',
        'font-size: 1.2rem; text-align: justify; color: #333333'
      );
      parrafo.parentElement.setAttribute('style', 'text-align: left');
    }
  }

  saveOpt(): void {
    const opt = {
      descripcion: this.descriptionOpt,
      documentos: this.documentsOpt,
      lecciones: this.lessonsOpt,
      ejercicios: this.exercisesOpt,
      evaluaciones: this.evaluationsOpt,
      anuncios: this.adsOpt,
      biblioteca: this.libraryOpt,
      glosario: this.glossaryOpt,
      videoconferencia: this.meetOpt,
      foros: this.forumOpt,
      chat: this.chatOpt,
    };

    this.courseService
      .editCourseOptions(this.courseId, opt)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Guardado exitosamente',
          confirmButtonText: 'cerrar',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Ocurrió un error' + error,
          confirmButtonText: 'cerrar',
        });
      });
  }

  goToAdsCurso(): void {
    if (this.admin) {
      this.route.navigate([`cursos/anuncios/${this.courseId}`]);
    } else {
      this.route.navigate([
        `cursos/anuncios/estudiante/${this.courseId}/${this.stdId}`,
      ]);
    }
  }
}
