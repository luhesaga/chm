import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit, OnDestroy {

  idCurso;
  idLesson;
  idContent;
  exercId;
  stdId;

  exerciseReceived;
  exercise;
  questions: any [];
  qNumber = 0;
  qType = 1;

  // respuestas seleccionadas
  uniqueSelAnswer;

  constructor(
    private activatedRoute: ActivatedRoute,
    private exercService: ExercisesService,
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.exercId = this.activatedRoute.snapshot.params.exercId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    //console.log(`curso: ${this.idCurso} leccion: ${this.idLesson}`);
    //console.log(`contenido: ${this.idContent} ejercicio: ${this.exercId} usuario: ${this.stdId}`);
  }

  ngOnInit(): void {
    this.getExercise();
  }

  ngOnDestroy(): void {
    this.exerciseReceived.unsubscribe();
  }

  getExercise() {
    this.exerciseReceived = this.exercService.exerciseDetail(this.idCurso, this.exercId)
      .valueChanges()
      .subscribe((ex: any) => {
        this.exercise = ex;
        this.questions = ex.preguntas;
        this.loadQuestion();
        this.loadAnswers();
        //console.log(this.exercise);
        console.log(this.questions);
      })
  }

  loadQuestion() {
    const ql = this.questions.length - 1;
    console.log(`pregunta ${this.qNumber + 1} de ${ql + 1}`);
    if (this.qNumber <= ql  && this.qNumber >= 0) {
      const question = this.questions[this.qNumber].question;
      console.log(question);
      document.getElementById('question').innerHTML = question;
    }
  }

  loadAnswers() {
    this.qType = this.questions[this.qNumber].type;
  }

  previousQuestion() {
    if (this.qNumber > 0) {
      this.qNumber -= 1;
      this.loadQuestion();
      this.loadAnswers();
    }
  }

  nextQuestion() {
    if (this.qNumber < this.questions.length - 1) {
      this.qNumber += 1;
      this.loadQuestion();
      this.loadAnswers();
    }
  }

  finishTest() {}

  uniqueSelected(event: MatRadioChange) {
    console.log(event)
  }

}
