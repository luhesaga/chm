import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import Swal from 'sweetalert2';
import { MailService } from '../../../../../core/services/mail/mail.service';

@Component({
  selector: 'app-matricular',
  templateUrl: './matricular.component.html',
  styleUrls: ['./matricular.component.scss'],
})
export class MatricularComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'sel',
    'nombre',
    'correo',
    'perfil',
    'fecha',
    'actions',
  ];
  dataSource = new MatTableDataSource();

  students: any[];
  selected;

  MassiveRegister: any[] = [];

  courseId;

  course;
  courseUsers;

  constructor(
    private courseService: CourseService,
    private mailService: MailService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<MatricularComponent>,
    @Inject(MAT_DIALOG_DATA) public dataReceived: any
  ) {
    this.getUserList();
    this.courseId = this.dataReceived[0].id;
    this.course = this.dataReceived[0];
    this.courseUsers = this.dataReceived[1];
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUserList(): void {
    this.userService
      .listUsers()
      .valueChanges()
      .subscribe((users) => {
        this.students = users;
        this.students.forEach((user) => {
          user.estado = 'no matriculado';
          user.fechaCreacion = user.fechaCreacion
            ? new Date(user.fechaCreacion).toLocaleDateString()
            : '';
          this.courseUsers.forEach((std) => {
            if (user.id === std.id) {
              user.estado = 'matriculado';
            }
          });
        });
        this.dataSource.data = this.students
          .filter((e: any) => e.estado !== 'matriculado')
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

  registerUser(
    estudiante: any,
    estadoMatricula: string,
    fechaFinalizacionMatricula: Date | string
  ) {
    Swal.fire({
      title: 'Matricular estudiante',
      text: `Va a registrar al usuario ${estudiante.nombres} ${estudiante.apellidos} en el curso, ¿esta seguro?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    })
      .then((result) => {
        if (result.value) {
          const dataMatricula = this.datosMatricula(
            estudiante,
            estadoMatricula,
            fechaFinalizacionMatricula
          );
          this.courseService
            .registerUserToCourse(dataMatricula, this.courseId, estudiante.id)
            .then(() => {
              this.sendEmailAnuncio(estudiante);
            })
            .catch((error) => {
              Swal.fire(
                'Error!',
                `La operación no se pudó realizar, ${error}.`,
                'error'
              );
            });
        }
      })
      .catch((error) => console.log(error));
  }

  datosMatricula(
    estudiante: any,
    matricula: string,
    fechaFinalizacionMatricula: Date | string
  ) {
    const data = {
      stdName: `${estudiante.nombres} ${estudiante.apellidos}`,
      fechaMatricula: new Date(),
      tipoMatricula: matricula,
      fechaFinalizacionMatricula,
    };
    return data;
  }

  inputMesesMatricula(estudiante: any, estadoMatricula: string) {
    Swal.fire({
      title: 'Meses',
      input: 'number',
      inputLabel:
        'Ingrese los meses de matricula. Solo puede matricular maximo 12 meses',
      confirmButtonText: 'MATRICULAR',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          const valueNumber = Number(value);
          if (valueNumber <= 0) {
            resolve('Los meses de matricula deben ser mayor a cero');
          } else if (valueNumber > 12) {
            resolve('Los meses de matricula deben ser menor a doce');
          } else {
            resolve('');
          }
        });
      },
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        const mesesMatricula = Number(confirm.value);
        const fechaFinalizacion =
          this.fechaFinalizacionMatricula(mesesMatricula);
        this.registerUser(estudiante, estadoMatricula, fechaFinalizacion);
      }
    });
  }

  fechaFinalizacionMatricula(valueNumber: number): Date {
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setMonth(fechaFinalizacion.getMonth() + valueNumber);
    return fechaFinalizacion;
  }

  async sendEmailAnuncio(estudiante) {
    const data = {
      nombre: estudiante.nombres,
      correo: estudiante.correo,
      curso: this.course.nombre,
    };
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data));
    await this.mailService
      .courseRegistration(data)
      .toPromise()
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Matriculado!',
            text: 'Estudiante matriculado exitosamente',
            confirmButtonText: 'cerrar',
          }).then(() => this.dialogRef.close());
        },
        (e) => {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: 'Correo no enviado',
            text: 'El correo de confirmación no pudo ser enviado.',
            confirmButtonText: 'cerrar',
          });
        }
      );
  }

  registerSelectedStudents(
    meses: number,
    fechaFin: string | Date,
    tipo: string
  ) {
    console.log(`${this.MassiveRegister.length} estudiantes seleccionados.`);
    const data = {
      meses,
      fechaFin,
      tipo,
    };
    if (this.selected) {
      Swal.fire({
        title: 'Matricula masiva',
        text: `Va a registrar a todos los estudiantes (${this.MassiveRegister.length}) 
              de la plataforma en el curso, se enviaran los correos de confirmación, 
              si continua, el proceso podrá demorar varios minutos, por favor no cierre
              el navegador hasta recibir el mensaje de confirmación. ¿esta seguro?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro!',
      })
        .then((result) => {
          if (result.value) {
            this.massiveRegister(data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      Swal.fire({
        title: 'Matricula masiva',
        text: `Va a registrar ${this.MassiveRegister.length} estudiantes en el curso, 
              se enviaran los correos de confirmación, 
              si continua, el proceso podrá demorar varios minutos dependiendo del número
              de estudiantes seleccionados, por favor no cierre
              el navegador hasta recibir el mensaje de confirmación. ¿esta seguro?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro!',
      })
        .then((result) => {
          if (result.value) {
            this.massiveRegister(data);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  individualStudentSelected(event: MatCheckboxChange) {
    if (!event.checked) {
      this.selected = false;
    }
    this.MassiveRegister = this.getSelectedStudents();
  }

  allSelected(event: MatCheckboxChange) {
    this.dataSource.data.forEach((d: any) => {
      event.checked ? (d.seleccionado = true) : (d.seleccionado = false);
    });
    this.MassiveRegister = this.getSelectedStudents();
  }

  getSelectedStudents(): any[] {
    return this.dataSource.data.filter((x: any) => x.seleccionado === true);
  }

  setRegisterTime() {
    Swal.fire({
      title: 'Meses',
      input: 'number',
      inputLabel:
        'Ingrese los meses de matricula. Solo puede matricular maximo 12 meses',
      confirmButtonText: 'MATRICULAR',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          const valueNumber = Number(value);
          if (valueNumber <= 0) {
            resolve('Los meses de matricula deben ser mayor a cero');
          } else if (valueNumber > 12) {
            resolve('Los meses de matricula deben ser menor a doce');
          } else {
            resolve('');
          }
        });
      },
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        const mesesMatricula = Number(confirm.value);
        const fechaFinalizacion =
          this.fechaFinalizacionMatricula(mesesMatricula);
        this.registerSelectedStudents(mesesMatricula, fechaFinalizacion, 'mes');
      }
    });
  }

  massiveRegister(data) {
    this.MassiveRegister.forEach((estudiante) => {
      const dataMatricula = this.datosMatricula(
        estudiante,
        data.tipo,
        data.fechaFin
      );
      this.courseService
        .registerUserToCourse(dataMatricula, this.courseId, estudiante.id)
        .then(() => {
          this.sendEmailMassive(estudiante);
        })
        .catch((error) => {
          Swal.fire(
            'Error!',
            `no se pudo matricular al estudiante ${estudiante.nombres}, ${error}.`,
            'error'
          );
        });
    });
    Swal.fire({
      icon: 'success',
      title: 'Matriculado!',
      text: `${this.MassiveRegister.length} Estudiantes matriculados exitosamente.`,
      confirmButtonText: 'cerrar',
    }).then(() => this.dialogRef.close());
  }

  async sendEmailMassive(estudiante) {
    const data = {
      nombre: estudiante.nombres,
      correo: estudiante.correo,
      curso: this.course.nombre,
    };
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data));
    await this.mailService
      .courseRegistration(data)
      .toPromise()
      .then(
        () => {
          console.log(`registrado ${estudiante.nombres}`);
        },
        (e) => {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: 'Correo no enviado',
            text: `El correo de confirmación no pudo ser enviado a usuario ${estudiante.nombres}.`,
            confirmButtonText: 'cerrar',
          });
        }
      );
  }
}
