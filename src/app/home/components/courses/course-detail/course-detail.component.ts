import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutComponent } from '../../../../dashboard/components/payu/checkout/checkout.component';

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
  precioCOP;
  courseReceived;

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

  user;

  constructor(
    private courseService: CourseService,
    private catService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private route: Router,
    private auth: AuthService,
    public dialog: MatDialog,
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    if (this.id.substring(0, 4) === 'view') {
      this.id = this.id.replace('view', '');
      this.dash = true;
    }

    this.userId = this.activatedRoute.snapshot.params.userId;
    if (this.userId) {
      this.dashboard = true;
    }

    this.setBreakpointObserver();
  }

  setBreakpointObserver(): void {
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
        }

        if (this.imgFrame) {
          this.setImgSizeToNormal(this.imgFrame);
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.courseQuery();
    const getUser = this.auth.user$.subscribe(u => {
      this.user = u;
      getUser.unsubscribe();
    });
  }

  async courseQuery(): Promise<void> {
    if (this.id) {
      const course = this.courseService.detailCourse(this.id)
        .valueChanges()
        .subscribe(curso => {
          this.nombre = curso.nombre;
          this.imagen = curso.imagen;
          this.profesor = curso.profesor;
          this.precioCOP = curso.precioCOP;
          this.courseReceived = curso;
          // obtener categoria
          this.getCategory(curso.categoria);
          // injectar contenido html en los divs
          this.divsFill(curso);
          course.unsubscribe();
        });
    }
  }

  getCategory(id): void {
    const category = this.catService.detailCategory(id)
      .valueChanges()
      .subscribe(cat => {
        this.categoria = cat.nombre;
        category.unsubscribe();
      });
  }

  async divsFill(curso): Promise<void> {
    if (curso.descripcion) {
      this.descDiv = document.getElementById('descripcion');
      this.descDiv.innerHTML = await curso.descripcion;
      this.loadDescriptionVideoOrImg();
    } else { this.descripcion = false; }

    if (curso.introduccion) {
      this.IntrDiv = document.getElementById('introduccion');
      this.IntrDiv.innerHTML = await curso.introduccion;
    } else { this.introduccion = false; }

    if (curso.objetivo) {
      this.objDiv = document.getElementById('objetivo');
      this.objDiv.innerHTML = await curso.objetivo;
    } else {
      this.objetivo = false;
    }

    if (curso.contenido) {
      this.contDiv = document.getElementById('contenido');
      this.contDiv.innerHTML = await curso.contenido;
    } else { this.contenido = false; }

    if (curso.duracion) {
      this.durDiv = document.getElementById('duracion');
      this.durDiv.innerHTML = await curso.duracion;
    } else { this.duracion = false; }

    if (curso.requisitos) {
      this.reqDiv = document.getElementById('requisitos');
      this.reqDiv.innerHTML = await curso.requisitos;
    } else { this.requisitos = false; }

    if (curso.dirigido) {
      this.dirDiv = document.getElementById('dirigido');
      this.dirDiv.innerHTML = await curso.dirigido;
    } else { this.dirigido = false; }

    if (curso.evaluacion) {
      this.evalDiv = document.getElementById('evaluacion');
      this.evalDiv.innerHTML = await curso.evaluacion;
    } else { this.evaluacion = false; }

    if (curso.calificacion) {
      this.calDiv = document.getElementById('calificacion');
      this.calDiv.innerHTML = await curso.calificacion;
    } else { this.calificacion = false; }
  }

  loadDescriptionVideoOrImg(): void {
    this.videoIframe = document.querySelector('iframe');
    if (this.videoIframe) {
      this.videoWidth = this.videoIframe.style.width;
      this.videoHeight = this.videoIframe.style.height;
      if (this.isMobile) {
        this.videoIframe.style.width = '280px';
        this.videoIframe.style.height = '140px';
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
    if (this.isMobile) {
      img.setAttribute('width', '70%');
      img.setAttribute('height', '70%');
    }
  }

  setImgSizeToNormal(img): void {
    img.setAttribute('width', '80%');
    img.setAttribute('height', '80%');
  }

  goToBuy(): void {

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
      this.courseService.registeredUSerDetail(this.courseReceived.id, this.user.id)
        .valueChanges()
        .subscribe(user => {
          if (user) {
            Swal.fire({
              title: `${this.courseReceived.nombre}`,
              text: 'Ya estas inscrito en este curso.',
              icon: 'info',
            });
          } else {
            this.openDialog();
          }
        });
    }
  }

  openDialog(): void {
    const config = {
      data: {
        message: 'curso',
        user: this.user,
        course: this.courseReceived
      },
    };

    const dialogRef = this.dialog.open(CheckoutComponent, config);
    dialogRef.afterClosed().subscribe(() => {});
  }

  goBack(): void {
    if (this.dashboard) {
      this.route.navigate([`/dashboard/cursos/list/${this.id}`]);
    } else {
      this.route.navigate(['/home/cursos']);
    }
  }

}
