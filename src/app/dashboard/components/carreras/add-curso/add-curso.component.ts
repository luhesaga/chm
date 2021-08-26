import { Component, OnInit, AfterViewInit, ViewChild   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private carrerasService: CarrerasService
  )
  {
    this.idCarreras = this.activatedRoute.snapshot.params.idCarreras;
    this.obtenerCursos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerCursos(){
    this.courseService.listCourses()
    .valueChanges()
    .subscribe(cursos => {
      this.dataSource.data = cursos;
      this.obtenerCursosCarrera();
    },
    () => this.mensajeError('Problemas de conexión, por favor recargue la página')
    );
  }

  obtenerCursosCarrera()
  {
    this.carrerasService.cursosAgregadosObtener(this.idCarreras)
    .valueChanges()
    .subscribe(cursos => {this.colocarCursosEnTabla(cursos);}
    , () => this.mensajeError('Error de conexión, por favor recargue la pagina'));
  }

  colocarCursosEnTabla(cursos:any[])
  {
    this.dataSource.data.forEach((curso:any)=> {
      const cursoAgregadoEncontrado = cursos.findIndex(cursoAgregado => cursoAgregado.id === curso.id);
      if(cursoAgregadoEncontrado=== -1)
      {
        curso.agregado= false;
      }
      else
      {
        curso.agregado= true;
      }
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

  quitarCurso(id:string)
  {
    this.carrerasService.quitarCurso(id, this.idCarreras)
    .then(()=>{}
    , () => this.mensajeError('No se pudo desmatricular al usuario, por favor intente otra vez'));
  }

}
