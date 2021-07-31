import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from 'src/app/home/components/courses/course-info/course-info.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.component.html',
  styleUrls: ['./course-home.component.scss']
})
export class CourseHomeComponent implements OnInit, OnDestroy {

  id: string;
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

  isMobile = false;

  videoWidth;
  videoHeight;
  videoIframe;

  imgWidth;
  imgHeight;
  imgFrame;

  curso;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private catService: CategoryService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private route: Router
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.stdId = this.activatedRoute.snapshot.params.stdId;

    if (this.stdId) {
      this.admin = false;
    }

    this.breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      //console.log(result);
      if (!result.matches) {
        this.isMobile = true;
        // tamaño mobile de video o img
        if (this.videoIframe) {
          this.videoIframe.style.width = '280px';
          this.videoIframe.style.height = '140px';
          console.log(this.videoIframe.style.height)
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
    this.ReceivedCourse = this.courseService.detailCourse(this.id).valueChanges()
      .subscribe(curso => {
        this.catService.detailCategory(curso.categoria).valueChanges()
          .subscribe(cat => {
            this.loadData(curso, cat);
            this.curso = curso;
            this.getCourseOptions(curso);
          });
      })
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    this.ReceivedCourse.unsubscribe();
  }

  getCourseOptions(course) {
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
      this.meetOpt = opt.videoconferencia ? opt.videoconferencia: opt.meet;
    }

  }

  goToLessons() {
    if (this.admin) {
      this.route.navigate([`cursos/lecciones/${this.id}`]);
    } else {
      this.route.navigate([`mis-cursos/lecciones/${this.id}/${this.stdId}`]);
    }
  }

  goToExercises() {
    this.route.navigate([`cursos/ejercicios/${this.id}`]);
  }

  goToGlossary() {
    if (this.admin) {
      this.route.navigate([`cursos/glosario/${this.id}`]);
    } else {
      this.route.navigate([`cursos/glosario/${this.id}/${this.stdId}`]);
    }
  }

  goToVideo() {
    if (this.admin) {
      this.route.navigate([`cursos/video-meet/${this.id}`]);
    } else {
      this.route.navigate([`cursos/video-meet/${this.id}/${this.stdId}`]);
    }
  }

  goToDocuments() {
    if (this.admin) {
      this.route.navigate([`documents/${this.id}`]);
    } else {
      this.route.navigate([`documents/${this.id}/${this.stdId}`]);
    }
  }

  goBack() {

    if (this.admin) {
      this.route.navigate(['dashboard/cursos']);
    } else {
      this.route.navigate([`dashboard/mis-cursos/${this.stdId}`]);
    }
  }

  openDialog(): void {
    const config = {
      data: {
        message: 'informacion del curso',
        content: this.curso
      }
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result ${result}`);
    });
  }

  loadData(curso, cat) {
    this.nombreCurso = curso.nombre;
    this.categoria = cat.nombre;

    this.descrDiv = document.getElementById('descripcion');
    this.descrDiv.innerHTML = curso.descripcion;
    this.loadDescriptionVideoOrImg();
  }

  loadDescriptionVideoOrImg() {
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

  setImgSizeToMobile(img) {
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

  setImgSizeToNormal(img) {
    //img.setAttribute('width', this.imgWidth);
    img.setAttribute('width', '80%');
    //img.setAttribute('height', this.imgHeight);
    img.setAttribute('height', '80%');
  }

  setFontSize() {
    const parrafo = document.querySelector('p span');
    console.log(parrafo);
    if (parrafo) {
      console.log(parrafo);
      parrafo.setAttribute('style','font-size: 1.2rem; text-align: justify; color: #333333');
      parrafo.parentElement.setAttribute('style','text-align: left');
    }
  }

  saveOpt() {
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
    }

    console.log(opt);

    this.courseService.editCourseOptions(this.id, opt)
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

  goToAdsCurso() {
    if (this.admin) {
      this.route.navigate([`cursos/anuncios/${this.id}`]);
    } else {
      this.route.navigate([`cursos/anuncios/estudiante/${this.id}/${this.stdId}`]);
    }
  }

}
