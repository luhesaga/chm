import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit, OnDestroy {

  private editorSubject: Subject<any> = new AsyncSubject();

  // temporizador
  date: Date;
  minutes;
  seconds;

  idCurso;
  idLesson;
  idContent;
  exercId;
  stdId;

  exerciseReceived;
  exercise;
  questions: any [];
  qNumber = 0;
  qType = 0;

  // respuestas seleccionadas
  totalAnswers: any = [];
  uniqueSelAnswer;
  freeAnswer;
  randomAnswers: any = [];
  relationAnswers: any = [];

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O',
              'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z']

  constructor(
    private activatedRoute: ActivatedRoute,
    private exercService: ExercisesService,
    private router: Router
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

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  getExercise() {
    this.exerciseReceived = this.exercService.exerciseDetail(this.idCurso, this.exercId)
      .valueChanges()
      .subscribe((ex: any) => {
        this.exercise = ex;
        // console.log(ex);
        if (ex.duracion < 60) {
          this.date = new Date(`2021-01-01 00:${ex.duracion}:59`);
        } else {
          this.date = new Date('2021-01-01 00:59:59');
        }
        this.startTempo();
        this.questions = ex.preguntas;
        this.loadQuestion();
        this.loadAnswers();
        //console.log(this.exercise);
        //console.log(this.questions);
      })
  }

  padLeft(n) {
    //let padLeft = n => "00".substring(0, "00".length - n.length) + n;
    return '00'.substring(0, '00'.length - n.length) + n;
  }

  startTempo() {
    const interval = setInterval(() => {
      this.minutes = this.padLeft(this.date.getMinutes() + "");
      this.seconds = this.padLeft(this.date.getSeconds() + "");
      //console.log(this.minutes, this.seconds);
      this.date = new Date(this.date.getTime() - 1000);
      if(this.minutes == '00' && this.seconds == '00' ) {
        Swal.fire({
          icon: 'info',
          title: '!Terminó el tiempo!',
          text: 'El tiempo ha terminado, se guardara el progreso.',
          confirmButtonText: 'cerrar',
        });
        clearInterval(interval);
        this.goToFinish();
      }
    }, 1200);
  }

  goToFinish() {
    const cid = this.idCurso;
        const lid = this.idLesson;
        const cntid = this.idContent;
        const exid = this.exercId;
        const stdid = this.stdId;
        this.router.navigate([`course-view/final-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}`])
  }

  loadQuestion() {
    const ql = this.questions.length - 1;
    //console.log(`pregunta ${this.qNumber + 1} de ${ql + 1}`);
    if (this.qNumber <= ql  && this.qNumber >= 0) {
      const question = this.questions[this.qNumber].question;
      //console.log(question);
      document.getElementById('question').innerHTML = question;
    }
  }

  loadAnswers() {
    this.qType = this.questions[this.qNumber].type;
    if (this.qType === 4) {
      
      const answers = this.questions[this.qNumber].answers;
      console.log(answers);
      this.randomAnswers = this.sortArray(answers);
      console.log(this.randomAnswers)
      // answers.forEach(a => {
      //   this.randomAnswers.push(a.comment);
      //   //console.log(a.answer);
      // })
    }
  }

  sortArray(arr) {
    // barajar array
    // copia del array
    let array = arr.slice();
    let currentIndex = array.length, temporaryValue, randomIndex;    //console.log(currentIndex)
    // Mientras queden elementos a mezclar...
    while (0 !== currentIndex) {
      // Seleccionar un elemento sin mezclar...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // E intercambiarlo con el elemento actual
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  previousQuestion() {
    this.randomAnswers.length = 0;
    this.relationAnswers.length = 0;
    if (this.qNumber > 0) {
      this.qNumber -= 1;
      this.loadQuestion();
      this.loadAnswers();
    }
  }

  nextQuestion() {
    const qType = this.questions[this.qNumber].type;
    console.log(qType)
    if ( qType === 4) {
      this.saveRelationAnswer();
    }
    this.randomAnswers.length = 0;
    this.relationAnswers.length = 0;
    if (this.qNumber < this.questions.length - 1) {
      this.qNumber += 1;
      this.loadQuestion();
      this.loadAnswers();
    }

    


  }

  saveRelationAnswer() {
    let cont = 0;
    this.relationAnswers.forEach(r => {
      console.log(r)
      if (r.correct) { cont += 1}
    })
    console.log(`cont: ${cont} length: ${this.relationAnswers.length}`)
    // if (cont === this.relationAnswers.length) {
    //   console.log('yuoi')
    // }
    console.log(Math.ceil(cont / this.relationAnswers.length * 100));
  }

  // preguntas seleccionadas
  // seleccion unica:
  uniqueSelected(event: MatRadioChange) {
    console.log(event)
  }

  // relacionar
  relationSelected(event: MatSelectChange, pos) {
    const l = this.questions[this.qNumber].answers.length;
    this.relationAnswers.length = l;
    const answer = this.parseHTML(this.questions[this.qNumber].answers[pos].answer);
    const option = this.parseHTML(this.questions[this.qNumber].answers[pos].comment);
    const selOpt = this.parseHTML(this.randomAnswers[event.value.value - 1].comment);
    const correctoption = this.questions[this.qNumber].answers[pos].relation;
    const userOption = this.randomAnswers[event.value.value - 1].relation;
    let correct = false;
    if (correctoption === userOption) {
      correct = true;
    }
    const userAnswer = {
      answer,
      option,
      selOpt,
      correctoption,
      userOption,
      correct
    }
    this.relationAnswers[pos] = userAnswer;
    console.log(this.relationAnswers);
  }




  // Utilidades manejo de html

  parseAnswer(answer) {
    let option = document.createElement('div');
    option.innerHTML = answer.answer;
    return option.textContent;
  }

  parseOption(answer) {
    let option = document.createElement('div');
    option.innerHTML = answer.comment;
    return option.textContent;
  }

  parseHTML(html) {
    let option = document.createElement('div');
    option.innerHTML = html;
    return option.textContent;
  }

  // Fin Utilidades manejo de html

  // **** Fin de la prueba **** //
  finishTest() {}

}
