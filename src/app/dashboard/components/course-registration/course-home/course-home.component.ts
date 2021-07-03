import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from 'src/app/home/components/courses/course-info/course-info.component';
import { CategoryService } from 'src/app/core/services/categories/category.service';
import { CourseService } from 'src/app/core/services/courses/course.service';

@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.component.html',
  styleUrls: ['./course-home.component.scss']
})
export class CourseHomeComponentRegistration implements OnInit, OnDestroy {

  id: string;
  ReceivedCourse;

  nombreCurso;
  categoria;
  descrDiv;
  descripcion;

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
    this.id = this.activatedRoute.snapshot.params.idCurso

    this.breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (!result.matches) {
        this.isMobile = true;
        // tamaño mobile de video o img
        if (this.videoIframe) {
          this.videoIframe.style.width = '280px';
          this.videoIframe.style.height = '140px';
          // console.log(this.videoIframe.style.height)
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
          });
      })
  }

  ngOnDestroy(): void {
    // cerrar subscribe
    this.ReceivedCourse.unsubscribe();
  }

  goToLessons() {
    this.route.navigate([`course-registration/lessons/${this.id}`]);
  }

  goToLecciones(idCourse:string)
  {
    this.route.navigateByUrl('course-registration/lessons/'+idCourse);
  }

  goToExercises() {
    this.route.navigate([`cursos/ejercicios/${this.id}`]);
  }

  goBack() {
    this.route.navigate(['dashboard/course-registration']);
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
    if (this.imgFrame) {
      this.setImgSizeToMobile(this.imgFrame);
    }
  }

  setImgSizeToMobile(img) {
    this.imgWidth = img.getAttribute('width');
    this.imgHeight = img.getAttribute('height');
    const w = parseInt(img.getAttribute('width')) / 2;
    const h = parseInt(img.getAttribute('height')) / 2;
    if (this.isMobile) {
      img.setAttribute('width', w);
      img.setAttribute('height', h);
    } else {
      this.setFontSize();
    }
  }

  setImgSizeToNormal(img) {
    img.setAttribute('width', this.imgWidth);
    img.setAttribute('height', this.imgHeight);
  }

  setFontSize() {
    const parrafo = document.querySelector('p span');
    if (parrafo) {
      console.log(parrafo);
      parrafo.setAttribute('style','font-size: 1.2rem; text-align: left; color: #333333');
      parrafo.parentElement.setAttribute('style','text-align: left');
    }
  }


}
