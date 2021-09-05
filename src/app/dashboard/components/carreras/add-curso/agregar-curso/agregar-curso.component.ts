import { Component, OnInit, ViewChild, AfterViewInit, Inject, OnDestroy  } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { Subscription } from 'rxjs';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.scss']
})
export class AgregarCursoComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource();

  unsubscribe: Subscription[];
  estudiantesMatriculados:any[];

  constructor(
    public dialogRef: MatDialogRef<AgregarCursoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataReceived:any,
    public carrerasService: CarrerasService,
    private courseService: CourseService,
  ) {
    this.unsubscribe=[];
    this.obtenerEstudiantesMatriculado();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy()
  {
    this.unsubscribe.forEach(subscription => subscription.unsubscribe());
  }

  obtenerEstudiantesMatriculado()
  {
    this.unsubscribe.push(this.carrerasService.matriculadosObtener(this.dataReceived.idCarrera)
    .valueChanges()
    .subscribe(estudiantes =>{
      this.estudiantesMatriculados= estudiantes;
      this.obtenerCursos();
    }));
  }

  obtenerCursos(){
    this.unsubscribe.push(
    this.courseService.listCourses()
    .valueChanges()
    .subscribe(cursos => {
      this.obtenerCursosCarrera(cursos);},
    () => this.mensajeError('Problemas de conexión, por favor recargue la página')
    ));
  }

  obtenerCursosCarrera(todosCursos:any[])
  {
    this.unsubscribe.push(this.carrerasService.cursosAgregadosObtener(this.dataReceived.idCarrera)
    .valueChanges()
    .subscribe( cursosCarrera => {
      this.obtenerCursosNoAgregados(todosCursos, cursosCarrera);},
    () => this.mensajeError('Problemas de conexión, por favor recargue la página')
    ));
  }

  obtenerCursosNoAgregados(todosCursos:any[], cursosCarrera:any[])
  {
    const cursosNoAgregados = todosCursos.filter(curso =>{
      const cursoEncontrado = cursosCarrera.findIndex(cursoCarrera => curso.id === cursoCarrera.id);
      if(cursoEncontrado===-1)
      {
        return true;
      }
      else
      {
        return false;
      }
    });
    this.dataSource.data = cursosNoAgregados;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerCursoAAgregar(element:any)
  {
    this.mensajeAgregandoCurso(element.nombre);
    this.obtenerEstadoMatriculaUsuario(element);
  }

  obtenerEstadoMatriculaUsuario(element:any)
  {
    const estudianteMatriculadoCurso =[];
    const estudianteNoMatriculadoCurso =[];
    let error =false;
    const cantidadEstudiantesCarrera = this.estudiantesMatriculados.length;
    if(cantidadEstudiantesCarrera!==0)
    {
      this.estudiantesMatriculados.forEach(estudiante =>{
        const unsubscribe = this.courseService.listCoursesByUser(element.id, estudiante.id)
        .valueChanges()
        .subscribe(async matricula => {
          if(matricula)
          {
            const data ={
              matriculaIndividual:matricula,
              estudianteCarrera: estudiante
            }
            estudianteMatriculadoCurso.push(data);
          }
          else
          {
            estudianteNoMatriculadoCurso.push(estudiante);
          }
          const estudiantesBuscados = estudianteMatriculadoCurso.length + estudianteNoMatriculadoCurso.length;
          if(estudiantesBuscados === cantidadEstudiantesCarrera)
          {
            await this.estadoEstudianteMatriculado(estudianteMatriculadoCurso, element.id)
            .then(e => error= e);
            if(!error)
            {
              await this.estadoEstudianteNoMatriculado(estudianteNoMatriculadoCurso, element.id)
              .then(e => error=e);
              if(!error)
              {
                this.agregarCursoACarrera(element);
              }
              else
              {
                this.mensajeError('No se pudo agregar la materia intentelo otra vez');
              }
            }
            else
            {
              this.mensajeError('No se pudo agregar la materia intentelo otra vez');
            }

          }
          unsubscribe.unsubscribe();
        });
      });
    }
  }

  async estadoEstudianteMatriculado(estudianteMatriculado:any[], cursoId:string)
  {
    const cantidadMatriculados = estudianteMatriculado.length;
    let i=0;
    let error = false;
    while(i < cantidadMatriculados && !error)
    {
      const matriculaIndividual = estudianteMatriculado[i].matriculaIndividual;
      const estudianteCarrera = estudianteMatriculado[i].estudianteCarrera;
      if(estudianteCarrera.tipoMatricula === 'indefinida' &&
      matriculaIndividual.tipoMatricula === 'mes')
      {
        const data={
          cursoId,
          fechaFinalizacionMatricula: matriculaIndividual.fechaFinalizacionMatricula,
          fechaMatricula: matriculaIndividual.fechaMatricula,
          tipoMatricula: matriculaIndividual.tipoMatricula
        }
        estudianteCarrera.matriculaIndividual.push(data);
        await this.carrerasService.actualizarMatriculaIndividual(estudianteCarrera, this.dataReceived.idCarrera)
        .then(async ()=>{
          await this.actualizarMatriculaIndividual(estudianteCarrera, cursoId)
          .then(errorActualizarMatricula => {error = errorActualizarMatricula});
        },
        ()=>error = true);
      }
      else if (estudianteCarrera.tipoMatricula === 'mes' &&
      matriculaIndividual.tipoMatricula === 'mes')
      {
        if(matriculaIndividual.fechaFinalizacionMatricula < estudianteCarrera.fechaFinalizacionMatricula)
        {

          const data={
            cursoId,
            fechaFinalizacionMatricula: matriculaIndividual.fechaFinalizacionMatricula,
            fechaMatricula: matriculaIndividual.fechaMatricula,
            tipoMatricula: matriculaIndividual.tipoMatricula
          }
          estudianteCarrera.matriculaIndividual.push(data);
          await this.carrerasService.actualizarMatriculaIndividual(estudianteCarrera, this.dataReceived.idCarrera)
          .then(async ()=>{
            await this.actualizarMatriculaIndividual(estudianteCarrera, cursoId)
            .then(errorActualizarMatricula => {error = errorActualizarMatricula});
          },
          ()=>error = true);

        }
      }
      ++i;
    }
    return error;
  }

  async actualizarMatriculaIndividual(estudianteCarrera: any,cursoId:string)
  {
    let error = false;
    await this.courseService.updateUserOfCourse(estudianteCarrera, cursoId, estudianteCarrera.id)
    .then(()=>{},()=> error= true);
    return error;
  }

  async estadoEstudianteNoMatriculado(estudianteNoMatriculadoCurso:any[], cursoId:string)
  {
    const cantidadNoMatriculados = estudianteNoMatriculadoCurso.length;
    let i = 0;
    let error =false;
    while(i < cantidadNoMatriculados && !error)
    {
      const estudiante = estudianteNoMatriculadoCurso[i];
      estudiante.stdName = estudiante.nombre;
      await this.courseService.registerUserToCourse(estudiante, cursoId, estudiante.id)
      .then(()=>{},
      ()=>{error=true;});
      ++i;
    }
    return error;
  }

  agregarCursoACarrera(element:any)
  {
    this.carrerasService.agregarCurso(element.id, this.dataReceived.idCarrera, element.nombre)
    .then(()=>{this.mensajeExito(`${element.nombre} agregado correctamente`)},
    ()=>{this.mensajeError('No se pudo agregar la materia intentelo otra vez')});
  }

  mensajeExito(mensaje:string)
  {
    Swal.fire({
      icon:'success',
      text:mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  mensajeError(mensaje:string)
  {
    Swal.fire({
      icon: 'error',
      text:mensaje,
      confirmButtonText: 'Cerrar'
    })
  }

  mensajeAgregandoCurso(nombre:string)
  {
    Swal.fire({
      title: `Agregando al curso ${nombre}`,
      didOpen:()=>{
        Swal.showLoading();
      }
    });
  }


}
