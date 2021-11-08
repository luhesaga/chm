import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import { ForumService } from '../../../../core/services/forums/forum.service';
import { CerticateService } from '../../../../core/services/certificate/certicate.service';

@Component({
  selector: 'app-std-evaluation',
  templateUrl: './std-evaluation.component.html',
  styleUrls: ['./std-evaluation.component.scss']
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
  hasCC = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private exerciseService: ExercisesService,
    private certificate: CerticateService,
    private foroService: ForumService,
    private lessonService: LessonsService,
    private userService: UsersService,
    private router: Router,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCourseInfo();
    this.getCourseLessons();
    this.getStudentInfo();
  }

  getCourseInfo() {
    let curso = this.courseService.detailCourse(this.courseId)
      .valueChanges()
      .subscribe(course => {
        this.courseReceived = course;
        curso.unsubscribe();
      })
  }

  getStudentInfo() {
    let std = this.userService.detailUser(this.stdId)
      .valueChanges()
      .subscribe(student => {
        this.stdReceived = student;
        std.unsubscribe();
      })
  }

  getCourseLessons() {
    let lessonsList = this.lessonService.listLessons(this.courseId)
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

  getlessonContent(lesson, index) {
    let contentList = this.lessonService.listCalificableLessons(this.courseId, lesson.id)
      .valueChanges()
      .subscribe((content: any) => {
        let ejercicio = {
          ejercicio: lesson.nombre,
        }
        content.forEach((ctn) => {
          if (ctn.tipo === 'Agregar foro') {
            this.getForumResult(ctn, lesson.id, ejercicio, index);
          } else {
            this.getUSerResult(ctn, ejercicio, index);
          }
        })
        contentList.unsubscribe();
      })
  }

  getUSerResult(contenido, ejercicio, index) {
    const ctnId = contenido.ejercicio.id;
    let userTest = this.exerciseService.getUserAnswers(this.courseId, ctnId, this.stdId)
      .valueChanges()
      .subscribe((item: any) => {
        let valor = 0;
        let mayor = 0;
        if (item.length > 0) {
          item.forEach(prueba => {
            valor = 0;
            prueba.respuestas.forEach(r => {
              valor += r.valor;
            });
            if (valor > 0) {
              valor = Math.ceil((valor / (prueba.respuestas.length * 100)) * 100);
              if (valor > mayor) {
                mayor = valor;
              }
            } else {
              valor = 0;
            }
          })
          this.totalGrade += mayor;
        }
        contenido.valor = mayor;
        ejercicio.contenido = contenido;
        this.totalContents += 1;
        this.lessonsReceived[index].notasLecciones.push(ejercicio.contenido);
        userTest.unsubscribe();
      });
  }

  getForumResult(contenido, lessonId, ejercicio, index) {
    let forumResult = this.foroService.getUserAnswers(this.courseId, lessonId, contenido.id, this.stdId)
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
        this.lessonsReceived[index].notasLecciones.push(ejercicio.contenido);
        forumResult.unsubscribe();
      })
  }

  goBack() {
    this.router.navigate([`cursos/index/${this.courseId}/${this.stdId}`]);
  }

  getTotal(a, b) {
    return Math.ceil(a / b);
  }

  isCertifiable(): boolean {
    this.cont += 1;
    let certifiable = false;
    if (this.totalGrade && this.totalContents) {
      if ((this.totalGrade / this.totalContents) >= 75 && this.lastLessonValidation()) {
        certifiable = true;
      }
    }
    if (this.cont === 123 && certifiable) {
      //console.log(this.cont);
      //console.log(certifiable);
      const data = this.getCerticateData();
      if (data.cc) {
        this.hasCC = true;
        this.certificate.generateCerticate(data, false);
      } else {
        this.hasCC = false;
      }
    }

    return certifiable;
  }

  lastLessonValidation(): boolean {
    let check = false;
    const notas = this.lessonsReceived[this.lessonsReceived.length - 1].notasLecciones;
    let cont = 0;
    notas.forEach(n => {
      if (n.valor > 0) {
        cont += 1;
      }
    });
    if (cont === notas.length) {
      check = true;
    }
    return check;
  }

  downloadPDFCerticate() {

    const data = this.getCerticateData();
    this.certificate.generateCerticate(data, true);

  }

  goToProfile() {
    this.router.navigate([`/usuarios/perfil/${this.stdReceived.id}`])
  }

  getCerticateData(): any {
    const data = {
      horas: this.getCourseDuration(),
      estudiante: `${this.stdReceived.nombres} ${this.stdReceived.apellidos}`,
      documento: 'Con documento de identidad ' + this.addCommas(this.stdReceived.identificacion),
      profesor: `${this.courseReceived.profesor}`,
      curso: `${this.courseReceived.nombre}`,
      stdId: this.stdId,
      courseId: this.courseId,
      siglaCurso: this.courseReceived.sigla,
      cc: this.stdReceived.identificacion,
      tipo: this.courseReceived.tipoCerticado,
    }

    return data;
  }

  addCommas(nStr): string {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }

  getCourseDuration() {
    let hours = this.courseReceived.duracion.toUpperCase();
    let h;
    let pos = hours.indexOf('HORAS');
    if (hours.substring(pos - 4)[0] === '>') {
      h = hours.substring(pos - 3, pos - 1);
    } else {
      h = hours.substring(pos - 4, pos - 1);
    }
    return h;
  }

}
