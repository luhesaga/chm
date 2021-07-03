import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { GlossaryService } from '../../../../core/services/glossary/glossary.service';
import { GlossaryCreateComponent } from '../glossary-create/glossary-create.component';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-glossary-list',
  templateUrl: './glossary-list.component.html',
  styleUrls: ['./glossary-list.component.scss']
})
export class GlossaryListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['termino', 'definicion', 'actions'];
  dataSource = new MatTableDataSource();
  filterData;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId;
  courseReceived;
  course;
  glossaryReceived;
  glossary;

  logguedUser;
  admin = true;
  listView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cursosService: CourseService,
    public dialog: MatDialog,
    private glossaryService: GlossaryService,
    private auth: AuthService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
  }

  ngOnInit(): void {
    this.getGlossary();
    this.getCourse();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getLogguedUser();
  }

  ngOnDestroy(): void {
    this.glossaryReceived.unsubscribe();
    this.courseReceived.unsubscribe();
  }

  getGlossary() {
    this.glossaryReceived = this.glossaryService
      .listGlossary(this.courseId)
      .valueChanges()
      .subscribe(g => {
        this.glossary = g;
        this.dataSource.data = g;
        this.filterData = g;
      });
  }

  getCourse() {
    this.courseReceived = this.cursosService.detailCourse(this.courseId)
      .valueChanges()
      .subscribe(c => {
        this.course = c;
      });
  }

  getLogguedUser() {
    this.auth.user$.subscribe((user) => {
      console.log(user);
      this.logguedUser = user;
      if (this.logguedUser.perfil !== 'administrador') {
        this.displayedColumns = ['termino', 'definicion'];
        this.admin = false;
        console.log(this.displayedColumns);
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goBack() {
    this.router.navigate([`cursos/index/${this.courseId}`]);
  }

  openDialog(exercise) {
    if (!exercise) {
      exercise = {
        courseId: this.courseId,
        action: 'new'
      }
    } else {
      exercise.courseId = this.courseId;
      exercise.action = 'edit';
    }

    const config = {
      data: {
        message: exercise.action === 'edit' ? 'Editar termino' : 'Agregar nuevo termino',
        content: exercise
      }
    };

    const dialogRef = this.dialog.open(GlossaryCreateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result ${result}`);
    });
  }

  changeView() {
    if (this.listView) {
      this.listView = false;
    } else {
      this.listView = true;
    }
  }

  deleteTerm(data) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara este término permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        this.glossaryService.deleteTerm(this.courseId, data.id)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Término eliminado exitosamente',
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
    })
    .catch(error => console.log(error));

  }

  parseHTML(data) {
    let p = document.getElementById(data.id);
    p.innerHTML = data.definicion;
  }

  parseStudentView(data) {
    let p = document.getElementById(data.id + 'st');
    p.innerHTML = data.definicion;
  }

  obtenerEventoSearch(evento: any)
  {
    let valor = evento.target.value;
    valor = valor.trim();
    let termino: any;
    if (valor !== '')
    {
      this.dataSource.data = this.filterData.filter((data) => {
          termino = data.termino + ' ' + data.definicion;
          return (termino.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      });
    } else
    {
      this.listaCompleta();
    }
  }

  listaCompleta()
  {
    this.dataSource.data = this.filterData;
  }

}
