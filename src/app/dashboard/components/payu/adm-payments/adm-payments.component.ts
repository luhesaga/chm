import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PayuService } from '../../../../core/services/payu/payu.service';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MailService } from 'src/app/core/services/mail/mail.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-adm-payments',
  templateUrl: './adm-payments.component.html',
  styleUrls: ['./adm-payments.component.scss'],
})
export class AdmPaymentsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'referencia',
    'moneda',
    'valor',
    'metodo',
    'estudiante',
    'cedula',
    'tipo',
    'fecha',
    'estado',
    'actions',
  ];
  dataSource = new MatTableDataSource();

  paymentsList;

  action: string;

  constructor(
    private pagosPayu: PayuService,
    private courseService: CourseService,
    private mailService: MailService,
    private careerService: CarrerasService
  ) {}

  ngOnInit(): void {
    this.getPaymentsList();
  }

  ngOnDestroy(): void {
    if (this.paymentsList) {
      this.paymentsList.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPaymentsList(): void {
    this.paymentsList = this.pagosPayu
      .listPayments()
      .valueChanges()
      .subscribe((pagos) => {
        // console.log(pagos);
        this.dataSource.data = pagos;
      });
  }

  checkPayment(element): void {
    this.action = 'matricular';
    Swal.fire({
      title: '¿Quieres aprobar este pago?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.pagosPayu
            .approvePayment(element.id)
            .then(() => {
              // codigo para inscribir estudiante al programa
              this.courseSubscribe(element);
              Swal.fire(
                'Pago aprobado',
                'El pago ha sido aprobado y el estudiante matriculado al programa de formación.',
                'success'
              );
            })
            .catch((err) => {
              Swal.fire('Error', `Error al aprobar ${err}`, 'error');
            });
        }
      })
      .catch((err) => console.log(err));
  }

  courseSubscribe(payData: any): void {
    if (payData.tipo === 'curso') {
      // curso
      const data = this.dataCourseToSubscribe(payData);
      this.checkUser(data, payData);
    } else {
      // carrera
      this.checkUserCareer(payData);
    }
  }

  // inscribir usuario a curso
  dataCourseToSubscribe(payData: any): any {
    return {
      stdName: payData.usuario,
      fechaMatricula: new Date(),
      fechaFinalizacionMatricula: this.fechaFinalizacionMatricula(3),
      tipoMatricula: 'mes',
    };
  }

  checkUser(data, payData): void {
    const registerCheck = this.courseService
      .registeredUSerDetail(payData.courseId, payData.idusuario)
      .valueChanges()
      .subscribe((user) => {
        if (!user) {
          console.log('matriculando al curso...');
          this.subscribeUserToCourse(data, payData);
        } else {
          console.log('estudiante ya matriculado');
        }
        registerCheck.unsubscribe();
      });
  }

  subscribeUserToCourse(data: any, payData: any): void {
    this.courseService
      .registerUserToCourse(data, payData.courseId, payData.idusuario)
      .then(() => {
        // enviar correo
        console.log('matriculado exitosamente al curso.');
        this.sendEmailToUser(payData.usuario, payData.correo, payData.course);
      })
      .catch((err) => console.log(err));
  }

  async sendEmailToUser(
    nombres: string,
    correo: string,
    curso: string
  ): Promise<void> {
    const data = {
      nombre: nombres,
      correo,
      curso,
    };
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data));
    await this.mailService
      .courseRegistration(data)
      .toPromise()
      .then(() => console.log('correo enviado'))
      .catch((err) => console.log(err));
  }

  // inscribir usuario a carrera
  checkUserCareer(payData): void {
    const registerCheck = this.careerService
      .getRegisteredUser(payData.courseId, payData.idusuario)
      .valueChanges()
      .subscribe((reg) => {
        if (!reg) {
          console.log('no registrado en la carrera, registrando...');
          this.getCareerCourses(payData);
        } else {
          console.log('registrado en la carrera');
        }
        registerCheck.unsubscribe();
      });
  }

  getCareerCourses(payData): void {
    const careerCourses = this.careerService
      .getCareerCourses(payData.courseId)
      .valueChanges()
      .subscribe((courses) => {
        if (this.action === 'matricular') {
          this.prepareSubscriptionToCareer(payData, courses);
        } else {
          this.getCareerUserData(payData, courses);
        }
        careerCourses.unsubscribe();
      });
  }

  prepareSubscriptionToCareer(payData: any, courses: any): any {
    const tipoMatricula = 'indefinida';
    const matriculaIndividual = [];
    const cursosNoMatriculados = [];
    let totalCourses = 0;
    const ultimoCurso = courses.length;

    courses.forEach((course) => {
      const matriculado = this.courseService
        .listCoursesByUser(course.id, payData.idusuario)
        .valueChanges()
        .subscribe((user: any) => {
          if (user) {
            const data = {
              tipoMatricula,
              fechaFinalizacionMatricula: user.fechaFinalizacionMatricula,
              fechaMatricula: user.fechaMatricula,
              cursoId: course.id,
            };
            matriculaIndividual.push(data);
            totalCourses += 1;
          } else {
            cursosNoMatriculados.push(course);
            totalCourses += 1;
          }

          if (totalCourses === ultimoCurso) {
            const coursesState = {
              matriculaIndividual,
              cursosNoMatriculados,
              tipoMatricula,
              fechaMatricula: new Date(),
              fechaFinalizacionMatricula: this.fechaFinalizacionMatricula(3),
              id: payData.idusuario
            };

            this.subscribeUserToCareer(coursesState, payData);
          }
          matriculado.unsubscribe();
        });
    });
  }

  subscribeUserToCareer(data: any, payData: any): void {
    data.stdName = payData.usuario;
    this.careerService
      .matricularUsuario(data, payData.courseId)
      .then(() => {
        this.subscribeUserToCareerCourses(data, payData);
      })
      .catch((err) => console.log(err));
  }

  subscribeUserToCareerCourses(data: any, payData: any): void {
    data.stdName = payData.usuario;
    const ultimoCurso = data.cursosNoMatriculados.length - 1;

    if (ultimoCurso !== -1) {
      data.cursosNoMatriculados.forEach((curso: any, index) => {
        this.courseService
          .registerUserToCourse(data, curso.id, payData.idusuario)
          .then(() => {
            if (ultimoCurso === index) {
              this.changeSubscribeState(data, payData);
            }
          })
          .catch((err) => console.log(err));
      });
    } else {
      this.changeSubscribeState(data, payData);
    }
  }

  changeSubscribeState(element: any, payData: any): void {
    const ultimoCurso = element.matriculaIndividual.length - 1;
    element.matriculaIndividual.forEach(async (curso: any, index) => {
      if (
        curso.tipoMatricula === 'mes' &&
        element.tipoMatricula === 'indefinida'
      ) {
        await this.courseService
          .updateUserOfCourse(element, curso.cursoId, element.id)
          .then(
            () => {},
            () => {
              console.log(
                `No se pudo actualizar la matricula de ${element.stdName}`
              );
            }
          )
          .catch(() => {
            console.log(
              `No se pudo actualizar la matricula de ${element.stdName}`
            );
          });
      } else if (
        curso.tipoMatricula === 'mes' &&
        element.tipoMatricula === 'mes'
      ) {
        if (
          element.fechaFinalizacionMatricula >
          curso.fechaFinalizacionMatricula.toDate()
        ) {
          await this.courseService
            .updateUserOfCourse(element, curso.cursoId, element.id)
            .then(
              () => {},
              () => {
                console.log(
                  `No se pudo actualizar la matricula de ${element.stdName}`
                );
              }
            )
            .catch(() => {
              console.log(
                `No se pudo actualizar la matricula de ${element.stdName}`
              );
            });
        }
      }
      if (ultimoCurso === index || ultimoCurso === -1) {
        console.log(`${element.stdName} matriculado exitosamente`);
        this.sendEmailToUser(payData.usuario, payData.correo, payData.course);
      }
    });
  }

  reversePayment(element): void {
    this.action = 'desmatricular';
    Swal.fire({
      title: '¿Quieres reversar este pago?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.pagosPayu
            .reversePayment(element.id)
            .then(() => {
              // codigo para desmatricular estudiante al curso
              if (element.tipo === 'curso') {
                this.unsubscribeStudent(element);
              } else {
                // codigo para desmatricular estudiante de la carrera
                this.getCareerCourses(element);
              }
              Swal.fire(
                'Pago rechazado',
                'El pago ha sido marcado como rechazado y el estudiante desmatriculado del programa de formación, si es carrera favor validar si el usuario se desmatriculó.',
                'success'
              );
            })
            .catch((err) => {
              Swal.fire('Error', `Error al eliminar ${err}`, 'error');
            });
        }
      })
      .catch((err) => console.log(err));
  }

  paymentDelete(element): void {
    Swal.fire({
      title: '¿Quieres eliminar este pago?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          if (element.estado !== 'Transacción aprobada') {
            this.pagosPayu
              .deletePayment(element.id)
              .then(() => {
                Swal.fire('Pago eliminado', '', 'success');
              })
              .catch((err) => {
                Swal.fire('Error', `Error al eliminar ${err}`, 'error');
              });
          } else {
            Swal.fire(
              'Error',
              `No se puede eliminar un pago aprobado.`,
              'error'
            );
          }
        }
      })
      .catch((err) => console.log(err));
  }

  unsubscribeStudent(data): void {
    this.courseService.deleteUserFromCourse(data.courseId, data.idusuario);
  }

  // desmatricular de carrera
  getCareerUserData(payData: any, courses: any): void {
    const careerUser = this.careerService
      .getRegisteredUser(payData.courseId, payData.idusuario)
      .valueChanges()
      .subscribe((user) => {
        payData.user = user;
        payData.cursosCarrera = courses;
        this.unsubscribeFromCareer(payData);
        careerUser.unsubscribe();
      });
  }

  unsubscribeFromCareer(data: any): void {
    // console.log(data);
    let error = false;
    let i = 0;
    const user = data.idusuario;
    const ultimaMatricula = data.user.matriculaIndividual.length - 1;

    while (i <= ultimaMatricula && !error) {
      const matricula = data.user.matriculaIndividual[i];
      error = this.updateSubscription(matricula, user);
      i++;
    }

    if (!error) {
      this.unsubscribeUSer(data);
    } else {
      console.log('error al matricular');
    }
  }

  updateSubscription(matriculaIndividual: any, idEstudiante: string): boolean {
    let error;
    this.courseService
      .updateUserOfCourse(
        matriculaIndividual,
        matriculaIndividual.cursoId,
        idEstudiante
      )
      .then(
        () => {
          error = false;
        },
        (err) => {
          error = true;
          console.log(err);
        }
      );
    return error;
  }

  unsubscribeUSer(data): void {
    const user = data.idusuario;
    const career = data.courseId;
    this.careerService.desmatricularUsuario(user, career)
      .then(() => console.log('desmatriculado de la carrera.'))
      .catch(err => console.log(`error al matricular: ${err}`));
  }

  fechaFinalizacionMatricula(valueNumber: number): Date {
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setMonth(fechaFinalizacion.getMonth() + valueNumber);
    return fechaFinalizacion;
  }
}
