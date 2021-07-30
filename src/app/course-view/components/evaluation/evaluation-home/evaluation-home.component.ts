import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';

@Component({
  selector: 'app-evaluation-home',
  templateUrl: './evaluation-home.component.html',
  styleUrls: ['./evaluation-home.component.scss']
})
export class EvaluationHomeComponent implements OnInit, OnDestroy {

  idCurso;
  idLesson;
  idContent;
  stdId;

  courseReceived;
  course;

  lessonReceived;
  lesson;

  evaluationReceived;
  evaluation;
  exercises;
  questions;

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
    this.lessonReceived.unsubscribe();
    this.evaluationReceived.unsubscribe();
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
    this.lessonReceived = this.lessonService.lessonDetail(this.idCurso, this.idLesson)
      .valueChanges()
      .subscribe(lesson => {
        this.lesson = lesson;
        // console.log(this.lesson);
      });
  }

  getLessonEvaluation() {
    this.evaluationReceived = this.lessonService.lessonContentDetail(this.idCurso, this.idLesson, this.idContent)
      .valueChanges()
      .subscribe((content: any) => {
        this.evaluation = content;
        this.exerciseService.exerciseDetail(this.idCurso, content.ejercicio.id)
          .valueChanges()
          .subscribe((exerc: any) => {
            console.log(exerc)
            this.exercises = exerc;
            this.questions = exerc.preguntas;
        })
        // console.log(this.evaluation);
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

  startExam() {
    const cid = this.idCurso;
    const lid = this.idLesson;
    const cntid = this.idContent;
    const exid = this.exercises.id;
    const stdid = this.stdId;

    this.router.navigate([`course-view/ver-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}`]);
    //this.router.navigate([`course-view/ver-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}`]);
  }

}
