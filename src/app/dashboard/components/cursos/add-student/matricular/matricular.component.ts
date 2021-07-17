import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricular',
  templateUrl: './matricular.component.html',
  styleUrls: ['./matricular.component.scss']
})
export class MatricularComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'correo', 'perfil', 'estado', 'actions'];
  dataSource = new MatTableDataSource();

  students:any[];

  courseId;

  course;
  courseUsers;

  constructor(
    private courseService: CourseService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<MatricularComponent>,
    @Inject(MAT_DIALOG_DATA) public dataReceived:any
  )
  {
    this.getUserList();
    this.courseId = this.dataReceived[0].id;
    this.course = this.dataReceived[0];
    this.courseUsers = this.dataReceived[1];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUserList():void
  {
    this.userService.listUsers()
    .valueChanges()
    .subscribe(users =>
    {
      this.students = users;
      this.students.forEach(user => {
        user.estado = 'no matriculado';
        this.courseUsers.forEach(std => {
          if (user.id === std.id) {
            user.estado = 'matriculado';
          }
        });
      })
      this.dataSource.data = this.students.filter( (e: any) => e.estado !== 'matriculado' )
        .sort(function (a, b) {
          if (a.nombres > b.nombres) {
            return 1;
          }
          if (a.nombres < b.nombres) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  registerUser(estudiante:any, estadoMatricula:string)
  {
    Swal.fire({
      title: 'Matricular estudiante',
      text: `Va a registrar al usuario ${estudiante.nombres} ${estudiante.apellidos} en el curso, ¿esta seguro?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        let stdName = `${estudiante.nombres} ${estudiante.apellidos}`;
        this.courseService.registerUserToCourse(stdName, this.courseId, estudiante.id)
        .then(() => {
          Swal.fire(
            'Registrado!',
            'Registro exitoso.',
            'success',
          );
          this.dialogRef.close();
        })
        .catch((error) => {
          Swal.fire(
            'Error!',
            `La operación no se pudó realizar, ${error}.`,
            'error',
          );
        });
      }
    })
    .catch(error => console.log(error));
  }

}
