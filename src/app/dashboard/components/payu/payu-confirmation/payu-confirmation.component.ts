import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailService } from 'src/app/core/services/mail/mail.service';
import { PayuService } from 'src/app/core/services/payu/payu.service';
import { CourseService } from '../../../../core/services/courses/course.service';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-payu-confirmation',
  templateUrl: './payu-confirmation.component.html',
  styleUrls: ['./payu-confirmation.component.scss'],
})
export class PayuConfirmationComponent implements OnInit {
  payuResponse;
  paymentData;
  PaymentMethod;
  transactionState;

  constructor(
    private activatedRoute: ActivatedRoute,
    private payuService: PayuService,
    private courseService: CourseService,
    private mailService: MailService,
    private careerService: CarrerasService,
    private userService: UsersService
  ) {
    this.payuResponse = this.activatedRoute.snapshot.queryParams;
  }

  ngOnInit(): void {
    // console.log(this.payuResponse);
    this.PaymentMethod = this.getPaymentMethod();
    this.transactionState = this.getTransactionState();
    this.getPaymentData();
    // console.log(this.transactionState);
  }

  getPaymentData(): void {
    const refCode = this.payuResponse.referenceCode;
    console.log(refCode);
    const paymentData = this.payuService
      .getPaymentByRef(refCode)
      .valueChanges()
      .subscribe((ref) => {
        if (ref) {
          this.paymentData = ref[0];
          const data = {
            metodoPago: this.PaymentMethod,
            estado: this.transactionState,
            fechaPago: this.payuResponse.processingDate,
            moneda: this.payuResponse.currency,
          };
          this.payuService
            .updatePayment(data, ref[0].id)
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
          if (this.transactionState === 'Transacción aprobada') {
            this.courseSubscribe(ref[0]);
            if (this.PaymentMethod === 'Cupón 100%') {
              Swal.fire('Felicidades', 'Excelente tu cupón fue aplicado exitosamente.', 'success' );
            }
          }
        }
        paymentData.unsubscribe();
      });
  }

  getPaymentMethod(): string {
    let metodo;

    switch (this.payuResponse.polPaymentMethodType) {
      case '2':
        metodo = 'Tarjetas de Crédito';
        break;
      case '4':
        metodo = 'Transferencias bancarias PSE';
        break;
      case '5':
        metodo = 'Débitos ACH';
        break;
      case '6':
        metodo = 'Tarjetas débito';
        break;
      case '7':
        metodo = 'Efectivo';
        break;
      case '8':
        metodo = 'Referencia de pago';
        break;
      case '10':
        metodo = 'Pago en bancos';
        break;
      case '14':
        metodo = 'Transferencias bancarias SPEI';
        break;
      case 'cupon':
        metodo = 'Cupón 100%';
        break;
    }

    return metodo;
  }

  getTransactionState(): string {
    const stateResponse = this.payuResponse.transactionState;
    let response: string;

    if (stateResponse === '4') {
      response = 'Transacción aprobada';
    } else if (stateResponse === '6') {
      response = 'Transacción rechazada';
    } else if (stateResponse === '104') {
      response = 'Error';
    } else if (stateResponse === '7') {
      response = 'Pago pendiente';
    } else {
      response = 'Sin respuesta';
    }

    return response;
  }

  courseSubscribe(payData: any): void {
    if (payData.tipo === 'curso') {
      console.log('curso');
      const data = this.dataCourseToSubscribe(payData);
      this.checkUser(data, payData);
    } else {
      console.log('carrera');
      this.checkUserCareer(payData);
    }
  }

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
        this.getCourseData(payData);
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

  getCourseData(payData: any): void {
    const courseData = this.courseService.detailCourse(payData.courseId)
      .valueChanges()
      .subscribe(course => {
        this.getTeacherData(course, payData);
        courseData.unsubscribe();
      });
  }

  getTeacherData(curso: any, payData: any): void {
    const teachersList = this.userService.listTeachers()
      .valueChanges()
      .subscribe(teachers => {
        teachers.forEach(teacher => {
          if (teacher.nombres + ' ' + teacher.apellidos === curso.profesor) {
            curso.emailProfesor = teacher.correo;
          }
        });
        this.enviarCorreoProfesor(curso, payData);
        teachersList.unsubscribe();
      });
  }

  async enviarCorreoProfesor(curso: any, payData: any): Promise<void> {
    const dataCorreo = {
      profesor: curso.profesor,
      mailProfesor: curso.emailProfesor,
      estudiante: payData.usuario,
      curso: curso.nombre,
      tipo: 'curso'
    };

    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(dataCorreo));
    await this.mailService
      .studentRegisterConfirmation(dataCorreo)
      .toPromise()
      .then(
        () => {
          console.log(`mail enviado a ${curso.profesor}`);
        },
        (e) => {
          console.log(e);
        }
      );
  }

  checkUserCareer(payData): void {
    const registerCheck = this.careerService
      .getRegisteredUser(payData.courseId, payData.idusuario)
      .valueChanges()
      .subscribe(reg => {
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
        .subscribe(courses => {
          this.prepareSubscriptionToCareer(payData, courses);
          careerCourses.unsubscribe();
        });
  }

  prepareSubscriptionToCareer(payData: any, courses: any): any {
    const tipoMatricula = 'mes';
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
    this.careerService.matricularUsuario(data, payData.courseId)
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
          .registerUserToCourse(
            data,
            curso.id,
            payData.idusuario
          )
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
        this.sendEmailToUser(
          payData.usuario,
          payData.correo,
          payData.course
        );
      }
    });
  }

  fechaFinalizacionMatricula(valueNumber: number): Date {
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setMonth(fechaFinalizacion.getMonth() + valueNumber);
    return fechaFinalizacion;
  }
}
