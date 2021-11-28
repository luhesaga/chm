import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from './course-info/course-info.component';
import { CourseService } from '../../../core/services/courses/course.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  cursos;
  userId;
  dashboard = false;

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
    let cursos = this.courseService.listCourses().valueChanges()
    .subscribe(courses => {
      courses.forEach(c => {
        this.catService.detailCategory(c.categoria).valueChanges()
          .subscribe(cat => {
            c.categoria = cat.nombre;
          })
      })
      this.cursos = this.estrellasCourses(courses);
      cursos.unsubscribe();
    });
  }

  estrellasCourses(courses:any[])
  {
    courses.forEach(course => {
      const estrellas:any[] = course.calificacionEstrellas;
      course.nroVotos = estrellas.length;
      this.haVotadoElUsuario(course);
    });
    return courses;
  }

  haVotadoElUsuario(course:any)
  {
    const estrellas:any[] = course.calificacionEstrellas;
    const encontrado = estrellas.findIndex(calificacion => calificacion.idUsuario == this.userId);
    if(encontrado === -1)
    {
      course.haVotado= false;
    }
    else
    {
      course.haVotado= true;
    }
    this.promedioVotos(course);
  }

  promedioVotos(course:any)
  {
    let promedio =0;
    const estrellas:any[] = course.calificacionEstrellas;
    estrellas.forEach(calificacion => {promedio +=calificacion.calificacion});
    if(estrellas.length>0)
    {
      promedio = Number.parseFloat(((promedio/estrellas.length).toString()));
    }
    course.promedio= promedio.toFixed(1);
  }

  openDialog(data): void {
    const config = {
      data: {
        message: 'informacion del curso',
        content: data
      }
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result ${result}`);
    });
  }

  goToCourseDetail(courseId) {
    if (this.dashboard) {
      this.route.navigate([`/dashboard/cursos/detalle/${courseId}/${this.userId}`]);
    } else {
      this.route.navigate([`/home/detalle-curso/${courseId}`]);
    }
  }

  agregarEstrella(calificacion:number, item:any)
  {
    const data={
      calificacion,
      idUsuario: this.userId
    };
    const estrellas:any[] = item.calificacionEstrellas;
    estrellas.push(data);
    this.courseService.agregarEstrella(estrellas, item.id)
    .then(()=>{
      this.bloquearVotoAlCurso(item);
      if(calificacion>1)
      {
        this.successSwal(`Gracias por su calificación de ${calificacion} estrellas`,'')
      }else
      {
        this.successSwal(`Gracias por su calificación de ${calificacion} estrella`,'')
      }
      },
      (e)=>{
        this.errorsSwal('No se pudo calificar el curso.','Por favor intentelo mas tarde')
        console.log(e)});
  }

  bloquearVotoAlCurso(item:any)
  {
    const indexCurso:number = this.cursos.findIndex(curso => curso.id === item.id);
    this.cursos[indexCurso].haVotado=true;
  }

  successSwal(title:string, message:string)
  {
    Swal.fire({
      icon:'success',
      title,
      text:message,
      confirmButtonText:'Aceptar',
    });
  }

  errorsSwal(title:string, message:string)
  {
    Swal.fire({
      icon:'error',
      title,
      text:message,
      confirmButtonText:'Cerrar',
    });
  }

}
