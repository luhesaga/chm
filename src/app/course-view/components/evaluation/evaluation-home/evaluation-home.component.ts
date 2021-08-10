import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-home',
  templateUrl: './evaluation-home.component.html',
  styleUrls: ['./evaluation-home.component.scss']
})
export class EvaluationHomeComponent implements OnInit, OnDestroy, DoCheck {

  idCurso;
  idLesson;
  idContent;
  stdId;
  exercId;

  courseReceived;
  course;

  // lessonReceived;
  lesson;

  // evaluationReceived;
  evaluation;
  exercises;
  questions;

  userTries = 0;
  canViewTest= true;
  previousTest;
  previousTestAnswers:any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonsService,
    private exerciseService: ExercisesService,
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    // console.log(`curso: ${this.idCurso} leccion: ${this.idLesson}`);
    // console.log(`contenido: ${this.idContent} usuario: ${this.stdId}`);
  }

  ngOnInit(): void {
    this.getCourse();
    this.getLesson();
    this.getLessonEvaluation();
  }

  ngOnDestroy(): void {
    this.courseReceived.unsubscribe();
    // this.lessonReceived.unsubscribe();
    // this.evaluationReceived.unsubscribe();
  }

  ngDoCheck(): void {
    // Validar mismo componente diferente contenido
    const idContent = this.activatedRoute.snapshot.params.idContent;
    if (idContent !== this.idContent) {
      this.idContent = idContent;
      this.ngOnInit();
    }
  }

  getCourse() {
    this.courseReceived = this.courseService.detailCourse(this.idCurso)
      .valueChanges()
      .subscribe(course => {
        this.course = course;
        // console.log(this.course);
      });
  }

  getLesson() {
    let lessonReceived = this.lessonService.lessonDetail(this.idCurso, this.idLesson)
      .valueChanges()
      .subscribe(lesson => {
        this.lesson = lesson;
        // console.log(this.lesson);
        lessonReceived.unsubscribe();
      });
  }

  getLessonEvaluation() {
    let evaluationReceived = this.lessonService.lessonContentDetail(this.idCurso, this.idLesson, this.idContent)
      .valueChanges()
      .subscribe((content: any) => {
        this.evaluation = content;
        this.getPreviousTries(content);
        // console.log(this.evaluation);
        evaluationReceived.unsubscribe();
      });
  }

  getPreviousTries(content) {
    this.exercId = content.ejercicio.id;
    let exc = this.exerciseService.getUserAnswers(this.idCurso, content.ejercicio.id, this.stdId)
      .valueChanges()
      .subscribe(exd => {
        this.previousTest = exd;
        console.log(this.previousTest);
        if (exd) {
          this.userTries = exd.length;
        }
        this.getExerciseDetail(content);
        exc.unsubscribe();
      })
  }

  getExerciseDetail(content) {
    let exc = this.exerciseService.exerciseDetail(this.idCurso, content.ejercicio.id)
      .valueChanges()
      .subscribe((exerc: any) => {
        console.log(exerc)
        this.exercises = exerc;
        this.questions = exerc.preguntas;
        if (this.userTries >= exerc.intentos) {
          this.canViewTest = false;
        }
        this.getPreviousTestAnswers(content)
        console.log(`puede ver la prueba: ${this.canViewTest}`);
        exc.unsubscribe();
    })
  }

  getPreviousTestAnswers(content) {
    this.previousTestAnswers.length = 0;
    this.previousTest.forEach(pt => {
      let prTsAn = this.exerciseService.detailTest(this.idCurso,content.ejercicio.id, this.stdId, pt.id)
        .valueChanges()
        .subscribe(pta => {
          let cont = 0;
          let valor = 0;
          pta.respuestas.forEach(r => {
            valor += r.valor;
            if (r.correcta) {
              cont += 1;
            }
          })
          // console.log(valor);
          pta.nota = Math.ceil((valor / pta.respuestas.length * 100) / 100);
          pta.correctas = cont;
          this.previousTestAnswers.push(pta);
          console.log(this.previousTestAnswers);
          prTsAn.unsubscribe();
        });
    });
  }

  getAnswersToPass() {
    let intentos = 0;
    if (this.questions && this.exercises) {
      const q = this.questions.length;
      const p = this.exercises.porcentaje;

      intentos = Math.ceil(q * (p / 100));
    }

    return intentos;
  }

  markAsViewed() {
    let progress = this.lessonService.ContentProgress(
      this.idCurso,
      this.idLesson,
      this.idContent,
      this.stdId
    ).valueChanges()
      .subscribe(p => {
        if (!p) {
          this.lessonService.CreateContentProgress(
            this.idCurso,
            this.idLesson,
            this.idContent,
            this.stdId
          ).then(() => console.log('actualizado'))
            .catch(error => console.log(error))
        }
        progress.unsubscribe();
      });
  }

  startExam() {

    if (this.canViewTest) {
      const cid = this.idCurso;
      const lid = this.idLesson;
      const cntid = this.idContent;
      const exid = this.exercises.id;
      const stdid = this.stdId;
      this.markAsViewed();
      this.router.navigate([`course-view/ver-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}`]);
      //this.router.navigate([`course-view/ver-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}`]);
    } else {
      Swal.fire({
        icon: 'error',
        title: '!Error!',
        text: 'No tiene más intentos para esta prueba.',
        confirmButtonText: 'cerrar',
      });
    }

  }

  goToTestResult(id) {
    const cid = this.idCurso;
    const lid = this.idLesson;
    const cntid = this.idContent;
    const exid = this.exercId;
    const stdid = this.stdId;
    this.router.navigate([`course-view/${cid}/${lid}/${stdid}/final-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}/${id}/consulta`])
  }

}
