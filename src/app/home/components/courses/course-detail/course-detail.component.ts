import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  panelOpenState = false;
  cursos = [];
  id;

  userId;
  dashboard = false;

  // divs para inyectar html
  descDiv;
  IntrDiv;
  objDiv;
  contDiv;
  durDiv;
  reqDiv;
  dirDiv;
  evalDiv;
  calDiv;

  nombre;
  imagen;
  profesor;
  categoria;

  descripcion = true;
  introduccion = true;
  objetivo = true;
  contenido = true;
  calificacion = true;
  duracion = true;
  requisitos = true;
  evaluacion = true;
  dirigido = true;

  // boton volver a dashboard
  dash = false;

  isMobile = false;

  videoWidth;
  videoHeight;
  videoIframe;

  imgWidth;
  imgHeight;
  imgFrame;

  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private route: Router,
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    if (this.id.substring(0,4) === 'view') {
      this.id = this.id.replace('view', '');
      this.dash = true;
    }

    this.userId = this.activatedRoute.snapshot.params.userId;
    if (this.userId) {
      this.dashboard = true;
    }

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

  async ngOnInit(): Promise<void> {
    await this.courseQuery();
  }

  async courseQuery(): Promise<void> {
    if (this.id) {
      this.courseService.detailCourse(this.id)
      .valueChanges()
      .subscribe(curso => {
        this.nombre = curso.nombre;
        this.imagen = curso.imagen;
        this.profesor = curso.profesor;
        // obtener categoria
        this.getCategory(curso.categoria);
        // injectar contenido html en los divs
        this.divsFill(curso);
        // console.log(curso);
      });
    }
  }

  getCategory(id) {
    this.catService.detailCategory(id).valueChanges()
          .subscribe(cat => {
            this.categoria = cat.nombre;
          })
  }

  async divsFill(curso) {
    if (curso.descripcion) {
      this.descDiv = document.getElementById('descripcion');
      this.descDiv.innerHTML = await curso.descripcion;
      this.loadDescriptionVideoOrImg();
    } else {this.descripcion = false;}

    if (curso.introduccion) {
      this.IntrDiv = document.getElementById('introduccion');
      this.IntrDiv.innerHTML = await curso.introduccion;
    } else {this.introduccion = false;}

    if (curso.objetivo) {
      this.objDiv = document.getElementById('objetivo');
      this.objDiv.innerHTML = await curso.objetivo;
    } else {
      this.objetivo = false;
    }

    if (curso.contenido) {
      this.contDiv = document.getElementById('contenido');
      this.contDiv.innerHTML = await curso.contenido;
    } else {this.contenido = false;}

    if (curso.duracion) {
      this.durDiv = document.getElementById('duracion');
      this.durDiv.innerHTML = await curso.duracion;
    } else {this.duracion = false;}

    if (curso.requisitos) {
      this.reqDiv = document.getElementById('requisitos');
      this.reqDiv.innerHTML = await curso.requisitos;
    } else {this.requisitos = false;}

    if (curso.dirigido) {
      this.dirDiv = document.getElementById('dirigido');
      this.dirDiv.innerHTML = await curso.dirigido;
    } else {this.dirigido = false;}

    if (curso.evaluacion) {
      this.evalDiv = document.getElementById('evaluacion');
      this.evalDiv.innerHTML = await curso.evaluacion;
    } else {this.evaluacion = false;}

    if (curso.calificacion) {
      this.calDiv = document.getElementById('calificacion');
      this.calDiv.innerHTML = await curso.calificacion;
    } else {this.calificacion = false;}
  }

  loadDescriptionVideoOrImg() {
    this.videoIframe = document.querySelector('iframe');
    if (this.videoIframe) {
      this.videoWidth = this.videoIframe.style.width;
      this.videoHeight = this.videoIframe.style.height;
      if (this.isMobile) {
        this.videoIframe.style.width = '280px';
        this.videoIframe.style.height = '140px';
        console.log(this.videoIframe.style.height)
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
    }
  }

  setImgSizeToNormal(img) {
    //img.setAttribute('width', this.imgWidth);
    img.setAttribute('width', '80%');
    //img.setAttribute('height', this.imgHeight);
    img.setAttribute('height', '80%');
  }

  goToBuy() {
    if (!this.dashboard) {
      Swal.fire({
        title: 'Comprar curso',
        text: 'Para adquirir nuestros cursos debes estar registrado, ¿deseas registrarte?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo registrarme!'
      })
      .then((result) => {
        if (result.value) {
          this.route.navigate(['home/register']);
        }
      })
      .catch(error => console.log(error));
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Proximamente!',
        text: 'Opción en construcción',
        confirmButtonText: 'cerrar',
    });
    }
  }

  goBack() {
    if (this.dashboard) {
      this.route.navigate([`/dashboard/cursos/list/${this.id}`]);
    } else {
      this.route.navigate(['/home/cursos']);
    }
  }

}
