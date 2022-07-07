import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import { CourseService } from '../../../../core/services/courses/course.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { MailService } from '../../../../core/services/mail/mail.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-evaluation-finish',
  templateUrl: './evaluation-finish.component.html',
  styleUrls: ['./evaluation-finish.component.scss'],
})
export class EvaluationFinishComponent implements OnInit, OnDestroy {
  // datos recibidos
  idCurso;
  idLesson;
  idContent;
  exercId;
  stdId;
  testId;
  revitionView = false;

  testReceived;
  test;
  courseInfo;
  stdInfo;
  ejercicio;

  // anwersReceived;
  answers;

  result: number;
  revition = false;
  revitionAll = false;

  textoFinal = 'Haz finalizado la Prueba.';
  mostrarResultados;

  letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'X',
    'Y',
    'Z',
  ];

  careerId;
  careerView = false;
  careerInfo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private exerService: ExercisesService,
    private courseService: CourseService,
    private careerService: CarrerasService,
    private mailService: MailService,
    private user: UsersService,
    private router: Router
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.exercId = this.activatedRoute.snapshot.params.exercId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.testId = this.activatedRoute.snapshot.params.testId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    const consulta = this.activatedRoute.snapshot.params.consulta;
    if (consulta) {
      this.revitionView = true;
      console.log(this.revitionView);
    }
    // console.log(`curso: ${this.idCurso} leccion: ${this.idLesson}`);
    // console.log(`contenido: ${this.idContent} ejercicio: ${this.exercId} usuario: ${this.stdId}`);
  }

  ngOnInit(): void {
    if (!this.careerView) {
      this.getCourseInfo();
    } else {
      this.getCareerInfo();
    }
    this.getUserInfo();
    this.getAllTest();
  }

  ngOnDestroy(): void {
    // this.anwersReceived.unsubscribe();
  }

  getCourseInfo(): void {
    const course = this.courseService
      .detailCourse(this.idCurso)
      .valueChanges()
      .subscribe((c) => {
        this.courseInfo = c;
        course.unsubscribe();
      });
  }

  getCareerInfo(): void {
    const career = this.careerService.obtenerCarrera(this.careerId)
      .valueChanges()
      .subscribe(c => {
        this.courseInfo = c;
        career.unsubscribe();
      });
  }

  getUserInfo(): void {
    const user = this.user
      .detailUser(this.stdId)
      .valueChanges()
      .subscribe((u) => {
        this.stdInfo = u;
        user.unsubscribe();
      });
  }

  getAllTest(): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    // const exid = this.careerView ? this.exercId : this.exercId;
    const finishExams = this.exerService
      .getUserAnswers(cid, this.exercId, this.stdId)
      .valueChanges()
      .subscribe((all) => {
        if (!this.careerView) {
          this.getCourseTest(all.length);
        } else {
          this.getCareerTest(all.length);
        }
        finishExams.unsubscribe();
      });
  }

  getCourseTest(totalTest): void {
    const testReceived = this.exerService
      .exerciseDetail(this.idCurso, this.exercId)
      .valueChanges()
      .subscribe((ex: any) => {
        // console.log(ex);
        this.ejercicio = ex;
        if (totalTest < ex.intentos) {
          this.revitionAll = false;
        } else {
          this.revitionAll = true;
        }
        this.mostrarResultados = ex.mostrarResultados;
        this.test = ex;
        if (ex.textoFinal) {
          this.textoFinal = this.parseHTML(ex.textoFinal);
        }
        this.getAnswers();
        testReceived.unsubscribe();
      });
  }

  getCareerTest(totalTest): void {
    const testReceived = this.careerService
      .exerciseDetail(this.careerId, this.exercId)
      .valueChanges()
      .subscribe((ex: any) => {
        this.ejercicio = ex;
        if (totalTest < ex.intentos) {
          this.revitionAll = false;
        } else {
          this.revitionAll = true;
        }
        this.mostrarResultados = ex.mostrarResultados;
        this.test = ex;
        if (ex.textoFinal) {
          this.textoFinal = this.parseHTML(ex.textoFinal);
        }
        this.getAnswers();
        testReceived.unsubscribe();
      });
  }

  getAnswers(): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const anwersReceived = this.exerService
      .detailTest(cid, this.exercId, this.stdId, this.testId)
      .valueChanges()
      .subscribe((u) => {
        // console.log(u);
        if (u) {
          this.validateQuestionsType(u);
        }
        if (u.fecha) {
          u.fecha = new Date(u.fecha).toLocaleDateString();
        }
        this.testReceived = u;
        this.answers = u.respuestas;
        // console.log(this.answers);
        let nota = 0;
        let contType5 = 0;
        u.respuestas.forEach((r) => {
          nota += r.valor;
          if (r.tipoPregunta === 5) {
            contType5 += 1;
          }
        });
        if (contType5 > 0) {
          this.revition = true;
        }
        this.result = Math.ceil((nota / (u.respuestas.length * 100)) * 100);
        anwersReceived.unsubscribe();
      });
  }

  goBack(revitionView): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const lid = this.idLesson;
    const exid = this.exercId;
    const sid = this.stdId;
    const cntid = this.idContent;
    if (!this.careerView) {
      if (revitionView) {
        this.router.navigate([
          `course-view/${cid}/${lid}/${sid}/evaluacion/${cid}/${lid}/${cntid}/${sid}`,
        ]);
      } else {
        this.router.navigateByUrl(`dashboard/course-view/${cid}/${lid}/${sid}`);
      }
    } else {
      if (revitionView) {
        this.router.navigate([
          `dashboard/evaluacion/${exid}/${sid}/${cid}`
        ]);
      } else {
        this.router.navigate([
          `dashboard/mis-cursos-lecciones-carrera/${sid}/${cid}`
        ]);
      }
    }
  }

  parseHTML(html): string {
    const option = document.createElement('div');
    option.innerHTML = html;
    return option.textContent;
  }

  qFormatter(question): any {
    let q = question.slice();
    while (q.indexOf('[') !== -1) {
      const inicio = q.indexOf('[');
      const final = q.indexOf(']');
      q = this.parseHTML(q.replace(q.substring(inicio, final + 1), '________'));
    }
    return q;
  }

  validateQuestionsType(respuestas): void {
    let cont = 0;
    if (!this.revitionView) {
      const preguntas: any[] = this.ejercicio.preguntas
        ? this.ejercicio.preguntas
        : null;
      if (preguntas) {
        preguntas.forEach((p) => {
          if (p.type === 5) {
            cont += 1;
          }
        });

        if (cont > 0 && !respuestas.revisado) {
          const data = {
            to: 'tutoria@chym-ndt.com',
            // to: 'luhesaga@gmail.com',
            asunto: `revision pendiente ${this.stdInfo.nombres} ${this.stdInfo.apellidos}`,
            curso: this.courseInfo.nombre,
            estudiante: this.stdInfo.nombres + ' ' + this.stdInfo.apellidos,
            prueba: this.ejercicio.nombre,
          };
          console.log('correo enviado');
          this.sendMail(data);
        }
      }
    }
  }

  sendMail(data): void {
    const unsubscribe = this.mailService.sendRevitionValidation(data).subscribe(
      () => unsubscribe.unsubscribe(),
      (e) => {
        console.log(e);
      }
    );
  }
}
