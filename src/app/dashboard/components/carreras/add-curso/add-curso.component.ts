import { Component, OnInit, AfterViewInit, ViewChild   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import {MatDialog} from '@angular/material/dialog';
import { AgregarCursoComponent } from './agregar-curso/agregar-curso.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-curso',
  templateUrl: './add-curso.component.html',
  styleUrls: ['./add-curso.component.scss']
})
export class AddCursoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'estado'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  idCarreras:string;
  cursoAgregados:any[];
  estudiantesMatriculados:any[];

  unsubscribe: Subscription[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private carrerasService: CarrerasService,
    public dialog: MatDialog
  )
  {
    this.unsubscribe=[];
    this.idCarreras = this.activatedRoute.snapshot.params.idCarreras;
    this.obtenerMatriculados();
    this.obtenerCursosCarrera();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy()
  {
    this.unsubscribe.forEach(subscription => subscription.unsubscribe());
  }


  obtenerMatriculados()
  {
    this.unsubscribe.push(this.carrerasService.matriculadosObtener(this.idCarreras)
    .valueChanges()
    .subscribe(estudiantes =>{
      this.estudiantesMatriculados = estudiantes;
    }));
  }

  obtenerCursosCarrera()
  {
    this.unsubscribe.push(this.carrerasService.cursosAgregadosObtener(this.idCarreras)
    .valueChanges()
    .subscribe(cursos => {
      this.dataSource.data = cursos;
      this.colocarEstadoAlCursos();}
    , () => this.mensajeError('Error de conexión, por favor recargue la pagina')));
  }

  colocarEstadoAlCursos()
  {
    this.dataSource.data.forEach((curso:any)=> {
        curso.agregado= true;
    });
  }

  ngOnInit(): void {
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mensajeError(mensaje:string)
  {
    Swal.fire({
      icon: 'error',
      text:mensaje,
      confirmButtonText: 'Cerrar'
    });
  }

  agregarCurso(element:any)
  {
    const nombre = element.nombre;
    this.carrerasService.agregarCurso(element.id, this.idCarreras, nombre)
    .then(()=>{}
    , () => this.mensajeError('No se pudo matricular al usuario, por favor intente otra vez'));
  }

  obtenerCurso(id:string)
  {
    this.buscarCursoEnEstudiantesMatriculados(id);
  }

  async buscarCursoEnEstudiantesMatriculados(idCurso:string)
  {
    const desmatricular=[], noDesmatricular=[];
    const cantidadEstudiantesMatriculados = this.estudiantesMatriculados.length;
    let i =0;
    while(i<cantidadEstudiantesMatriculados)
    {
      const estudiante = this.estudiantesMatriculados[i];
      const encontrado = estudiante.matriculaIndividual.findIndex(matricula=> matricula.cursoId === idCurso);
      if(encontrado === -1)
      {
        desmatricular.push(estudiante);
      }
      else
      {
        const data ={
          estudiante,
          encontrado
        }
        noDesmatricular.push(data);
      }
      ++i;
    }
    this.obtenerUsuarioParaDesmatricular(idCurso, desmatricular, noDesmatricular);
  }

  async obtenerUsuarioParaDesmatricular(idCurso:string, estudiantes:any[], noDesmatricular:any[])
  {
    const cantidadEstudiantes = estudiantes.length - 1;
    const desmatricular =[];
    let error = false;
    let i=0;
    if(cantidadEstudiantes !== -1)
    {
      estudiantes.forEach((estudiante) => {
        const unsubscribe = this.courseService.listCoursesByUser(idCurso, estudiante.id)
        .valueChanges()
        .subscribe(async estudianteCurso=> {
          if (estudianteCurso)
          {
            if(estudiante.fechaMatricula.toDate().getTime() === estudianteCurso.fechaMatricula.toDate().getTime())
            {
              desmatricular.push(estudiante);
            }
            if(i === cantidadEstudiantes)
            {
              await this.recorrerArrayDesmatricula(desmatricular, idCurso);
              if(!error)
              {
                await this.recorrerArrayNoDesmatricular(noDesmatricular)
                .then(e => error =e);
                if(!error)
                {
                  this.quitarCurso(idCurso);
                }
                else
                {
                  this.mensajeError('No se pudo quitar el curso, por favor intente otra vez');
                }
              }
              else
              {
                this.mensajeError('No se pudo quitar el curso, por favor intente otra vez');
              }
            }
          }
          ++i;
          unsubscribe.unsubscribe();
        });
      });
    }
    else
    {
      await this.recorrerArrayNoDesmatricular(noDesmatricular)
      .then(e => error =e);
      if(!error)
      {
        this.quitarCurso(idCurso);
      }
      else
      {
        this.mensajeError('No se pudo quitar el curso, por favor intente otra vez');
      }
    }
  }

  async recorrerArrayDesmatricula(desmatricular:any[], idCurso:string)
  {
    let error = false, i=0;
    const cantidadEstudiantes = desmatricular.length;
    while(i<cantidadEstudiantes && !error)
    {
      const estudiante = desmatricular[i];
      await this.desmatricularEstudianteCurso(idCurso, estudiante.id)
      .then(e => error=e);
      i++;
    }
    return error;
  }

  async desmatricularEstudianteCurso(idCurso:string, idEstudiante:string)
  {
    let error=false;
    await this.courseService.deleteUserFromCourse(idCurso, idEstudiante)
    .then(()=>{},
    ()=>error=true);
    return error;
  }

  async recorrerArrayNoDesmatricular(noDesmatricular:any[])
  {
    let error = false;
    await noDesmatricular.forEach(async datos =>{
      const estudiante= datos.estudiante;
      const encontrado= datos.encontrado;
      await this.actualizarMatriculaDeCurso(estudiante, encontrado)
      .then(e => error =e);
      estudiante.matriculaIndividual.splice(encontrado, 1);
      await this.actualizarCarreraMatriculaIndividual(estudiante)
      .then(e => error =e);
    });
    return error;
  }

  async actualizarMatriculaDeCurso(estudiante:any, index:number)
  {
    let error = false;
    const matriculaIndividual = estudiante.matriculaIndividual[index];
    await this.courseService.updateUserOfCourse(matriculaIndividual, matriculaIndividual.cursoId, estudiante.id)
    .then(()=>{},
    ()=> error = true);
    return error;
  }

  async actualizarCarreraMatriculaIndividual(estudiante:any)
  {
    let error = false;
    await this.carrerasService.actualizarMatriculaIndividual(estudiante, this.idCarreras)
    .then(()=>{},
    ()=> error=true);
    return error;
  }

  quitarCurso(id:string)
  {
    this.carrerasService.quitarCurso(id, this.idCarreras)
    .then(()=>{ this.mensajeExito('Curso quitado exitosamente')}
    , () => this.mensajeError('No se pudo desmatricular al usuario, por favor intente otra vez'));
  }

  openDialog()
  {
    this.dialog.open(AgregarCursoComponent,{
      height: '90%',
      width: '90%',
      data:{idCarrera: this.idCarreras}
    });
  }

  mensajeExito(mensaje:string)
  {
    Swal.fire({
      icon:'success',
      text:mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  validarQuitarCurso(id:string, nombre:string)
  {
    Swal.fire({
      icon: 'warning',
      text:'¿Seguro desa quitar el curso?',
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText:'No',
    })
    .then((result)=> {
      if(result.value)
      {
        this.obtenerCurso(id);
        this.mensajeQuitandoCurso(nombre)
      }
    });
  }

  mensajeQuitandoCurso(nombre:string)
  {
    Swal.fire({
      title: `Quitando curso de ${nombre}`,
      didOpen:()=>{
        Swal.showLoading();
      }
    });
  }

}
