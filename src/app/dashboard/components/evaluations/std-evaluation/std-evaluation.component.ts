import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import { ForumService } from '../../../../core/services/forums/forum.service';
import { CerticateService } from '../../../../core/services/certificate/certicate.service';
import Swal from 'sweetalert2';
import { MailService } from 'src/app/core/services/mail/mail.service';

@Component({
  selector: 'app-std-evaluation',
  templateUrl: './std-evaluation.component.html',
  styleUrls: ['./std-evaluation.component.scss'],
})
export class StdEvaluationComponent implements OnInit {
  courseId;
  courseReceived;
  stdId;
  stdReceived;
  lessonsReceived;
  totalGrade = 0;
  totalContents = 0;
  certificado = false;
  cont = 0;
  contador = 0;
  hasCC = true;
  careerId: string;
  careerView = false;
  stdIsCertifiable = false;
  cursoFinalizado = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private exerciseService: ExercisesService,
    private certificate: CerticateService,
    private foroService: ForumService,
    private lessonService: LessonsService,
    private userService: UsersService,
    private router: Router,
    private mailService: MailService
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    this.stdId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.validarAprobado();
    this.getCourseInfo();
    this.getCourseLessons();
    this.getStudentInfo();
  }

  validarAprobado(): void {
    const validar = this.courseService.obtenerCursoFinalizado(this.courseId, this.stdId)
      .valueChanges()
      .subscribe(aprobado => {
        if (aprobado) {
          this.cursoFinalizado = true;
        }
        console.log(this.cursoFinalizado);
        validar.unsubscribe();
      });
  }

  getCourseInfo(): void {
    const curso = this.courseService
      .detailCourse(this.courseId)
      .valueChanges()
      .subscribe((course) => {
        this.getTeacherInfo(course);
        const allowCert = this.courseService
          .registeredUSerDetail(this.courseId, this.stdId)
          .valueChanges()
          .subscribe((data) => {
            // console.log(data);
            if (data?.bloquearCert) {
              course.bloquearCert = true;
            } else {
              course.bloquearCert = false;
            }
            this.courseReceived = course;
            // console.log(this.courseReceived);
            allowCert.unsubscribe();
          });
        curso.unsubscribe();
      });
  }

  getStudentInfo(): void {
    const std = this.userService
      .detailUser(this.stdId)
      .valueChanges()
      .subscribe((student) => {
        this.stdReceived = student;
        std.unsubscribe();
      });
  }

  getTeacherInfo(curso: any): void {
    const teacherData = this.userService
      .listTeachers()
      .valueChanges()
      .subscribe((teachers) => {
        teachers.forEach((teacher) => {
          if (teacher.nombres + ' ' + teacher.apellidos === curso.profesor) {
            curso.emailProfesor = teacher.correo;
          }
        });
        teacherData.unsubscribe();
      });
  }

  getCourseLessons(): void {
    const lessonsList = this.lessonService
      .listLessons(this.courseId)
      .valueChanges()
      .subscribe((lessons: any) => {
        this.lessonsReceived = lessons;
        lessons.forEach((l, index) => {
          this.lessonsReceived[index].notasLecciones = [];
          this.getlessonContent(l, index);
        });
        lessonsList.unsubscribe();
      });
  }

  getlessonContent(lesson, index): void {
    const contentList = this.lessonService
      .listCalificableLessons(this.courseId, lesson.id)
      .valueChanges()
      .subscribe((content: any) => {
        const ejercicio = {
          ejercicio: lesson.nombre,
        };
        content.forEach((ctn) => {
          if (ctn.tipo === 'Agregar foro') {
            if (ctn.foroCalificable) {
              this.getForumResult(ctn, lesson.id, ejercicio, index);
            }
          } else {
            this.getUSerResult(ctn, ejercicio, index);
          }
        });
        contentList.unsubscribe();
      });
  }

  getUSerResult(contenido, ejercicio, index): void {
    const ctnId = contenido.ejercicio.id;
    const userTest = this.exerciseService
      .getUserAnswers(this.courseId, ctnId, this.stdId)
      .valueChanges()
      .subscribe((item: any) => {
        let valor = 0;
        let mayor = 0;
        if (item.length > 0) {
          item.forEach((prueba) => {
            valor = 0;
            prueba.respuestas.forEach((r) => {
              valor += r.valor;
            });
            if (valor > 0) {
              valor = Math.ceil(
                (valor / (prueba.respuestas.length * 100)) * 100
              );
              if (valor > mayor) {
                mayor = valor;
              }
            } else {
              valor = 0;
            }
          });
          this.totalGrade += mayor;
        }
        contenido.valor = mayor;
        ejercicio.contenido = contenido;
        this.totalContents += 1;
        this.stdIsCertifiable = this.isCertifiable(this.lastLessonValidation());
        this.lessonsReceived[index].notasLecciones.push(ejercicio.contenido);
        userTest.unsubscribe();
      });
  }

  getForumResult(contenido, lessonId, ejercicio, index): void {
    const forumResult = this.foroService
      .getUserAnswers(this.courseId, lessonId, contenido.id, this.stdId)
      .valueChanges()
      .subscribe((f: any) => {
        if (f.length > 0) {
          contenido.valor = f[0].valor;
        } else {
          contenido.valor = 0;
        }
        this.totalGrade += contenido.valor;
        this.totalContents += 1;
        ejercicio.contenido = contenido;
        this.stdIsCertifiable = this.isCertifiable(this.lastLessonValidation());
        this.lessonsReceived[index].notasLecciones.push(ejercicio.contenido);
        forumResult.unsubscribe();
      });
  }

  goBack(): void {
    if (!this.careerView) {
      this.router.navigate([`cursos/index/${this.courseId}/${this.stdId}`]);
    } else {
      this.router.navigate([
        `cursos-carrera/index/${this.courseId}/${this.stdId}/${
          this.careerId
        }/${'std'}`,
      ]);
    }
  }

  getTotal(a, b): number {
    return Math.ceil(a / b);
  }

  isCertifiable(lastLessonValidation: boolean): boolean {
    let certifiable = false;
    if (!this.cursoFinalizado) {
      console.log('porcentaje aprobación: ' + this.courseReceived.porcentaje);
      console.log(
        'porcentaje curso: ' + this.getTotal(this.totalGrade, this.totalContents)
      );
      // console.log(this.totalContents);
      this.cont += 1;
      if (this.totalGrade && this.totalContents) {
        const porcentaje = this.courseReceived.porcentaje
          ? this.courseReceived.porcentaje
          : 0;
        console.log(porcentaje);
        if (
          this.getTotal(this.totalGrade, this.totalContents) >= porcentaje &&
          lastLessonValidation
        ) {
          certifiable = true;
        }
      }
      if (certifiable) {
        const data = this.getCerticateData();
        if (data.cc) {
          this.hasCC = true;
          this.certificate.generateCerticate(data, false);
          if (this.contador === 0) {
            this.courseService
            .finalizarCurso(
              this.courseId,
              this.stdId,
              this.getTotal(this.totalGrade, this.totalContents)
            )
            .then(() => console.log('curso finalizado'))
            .catch((err) => console.log(err));
            this.enviarCorreoProfesor(data);
          }
        } else {
          this.hasCC = false;
        }
      }
      this.contador += 1;
    } else {
      this.hasCC = true;
      certifiable = true;
    }

    console.log(certifiable);
    return certifiable;

  }

  async enviarCorreoProfesor(data: any): Promise<void> {
    const dataCorreo = {
      profesor: data.profesor,
      mailProfesor: this.courseReceived.emailProfesor,
      estudiante: data.estudiante,
      curso: data.curso,
      tipo: 'curso',
    };

    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(dataCorreo));
    await this.mailService
      .courseFinalization(dataCorreo)
      .toPromise()
      .then(
        () => {
          console.log(`mail enviado a ${data.profesor}`);
        },
        (e) => {
          console.log(e);
        }
      );
  }

  lastLessonValidation(): boolean {
    let check = false;
    const notas =
      this.lessonsReceived[this.lessonsReceived.length - 1].notasLecciones;
    let cont = 0;
    notas.forEach((n) => {
      if (n.valor > 0) {
        cont += 1;
      }
    });
    if (cont === notas.length) {
      check = true;
    }
    return check;
  }

  downloadPDFCerticate(): void {
    if (this.courseReceived.bloquearCert) {
      Swal.fire(
        'Error',
        'No tiene permitido descargar este certificado.',
        'error'
      );
    } else {
      const data = this.getCerticateData();
      Swal.fire({
        confirmButtonColor: '#005691',
        showConfirmButton: false,
        title: 'Generando el certificado...',
        timer: 10000,
        timerProgressBar: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      this.certificate.generateCerticate(data, true);
    }
  }

  goToProfile(): void {
    this.router.navigate([`/usuarios/perfil/${this.stdReceived.id}`]);
  }

  getCerticateData(): any {
    return {
      horas: this.courseReceived.duracionCurso,
      estudiante: `${this.stdReceived.nombres} ${this.stdReceived.apellidos}`,
      documento:
        'Con documento de identidad ' +
        this.addCommas(this.stdReceived.identificacion),
      documento2: this.addCommas(this.stdReceived.identificacion),
      profesor: `${this.courseReceived.profesor}`,
      curso: `${this.courseReceived.nombre}`,
      stdId: this.stdId,
      courseId: this.courseId,
      siglaCurso: this.courseReceived.sigla,
      cc: this.stdReceived.identificacion,
      tipo: this.courseReceived.tipoCerticado,
      plantilla: this.courseReceived.plantilla,
      vence: this.courseReceived.vence,
      vencimiento: this.courseReceived.vencimiento,
    };
  }

  addCommas(nStr): string {
    nStr += '';
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }
}
