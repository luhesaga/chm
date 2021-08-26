import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-estudiantes',
  templateUrl: './add-estudiantes.component.html',
  styleUrls: ['./add-estudiantes.component.scss']
})
export class AddEstudiantesComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['nombre', 'matricula'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  idCarreras:string;
  matriculados:any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private carrerasService: CarrerasService
    )
    {
      this.idCarreras = this.activatedRoute.snapshot.params.idCarreras;
      this.obtenerUsuarios();
    }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerUsuarios()
  {
    this.userService.listUsers()
    .valueChanges()
    .subscribe(users => {
      this.dataSource.data=users;
      this.obtenerMatriculados();
    }, () => this.mensajeError('Error de conexión, por favor recargue la pagina'));
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerMatriculados()
  {
    this.carrerasService.matriculadosObtener(this.idCarreras )
    .valueChanges()
    .subscribe(matriculados => {this.colocarMatriculadosEnTabla(matriculados)}
    , () => this.mensajeError('Error de conexión, por favor recargue la pagina'));
  }

  colocarMatriculadosEnTabla(matriculados:any[])
  {
    this.dataSource.data.forEach((usuario:any) =>{
      const usuarioMatriculado =matriculados.findIndex(matriculado => matriculado.id === usuario.id);
      if(usuarioMatriculado === -1)
      {
        usuario.matriculado = false;
      }
      else
      {
        usuario.matriculado = true;
      }
    });
  }

  matricularUsuario(element:any)
  {
    const nombre = element.nombres+' '+element.apellidos
    this.carrerasService.matricularUsuario(element.id, this.idCarreras, nombre)
    .then(()=>{}
    , () => this.mensajeError('No se pudo matricular al usuario, por favor intente otra vez'));
  }

  desmatricularUsuario(id:string)
  {
    this.carrerasService.desmatricularUsuario(id, this.idCarreras)
    .then(()=>{}
    , () => this.mensajeError('No se pudo desmatricular al usuario, por favor intente otra vez'));
  }

  mensajeError(mensaje:string)
  {
    Swal.fire({
      icon: 'error',
      text:mensaje,
      confirmButtonText: 'Cerrar'
    })
  }

}
