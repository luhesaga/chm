import {
  Component,
  DoCheck,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { MatSelectChange } from '@angular/material/select';
import { AngularFirestore } from '@angular/fire/firestore';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss'],
})
export class EvaluationViewComponent implements OnInit, OnDestroy {
  // @HostListener('window:keydown', ['$event'])
  // handleKeyDown(event: KeyboardEvent) {
  //   // console.log(event);
  //   switch (event.key) {
  //     case 'ArrowRight':
  //       this.nextQuestion();
  //       break;
  //     case 'ArrowLeft':
  //       this.previousQuestion();
  //       break;
  //   }
  // }

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
  questions: any[];
  qNumber = 0;
  qType = 0;
  finishedExams;
  testEnd = false;
  endTempo = false;

  // respuestas seleccionadas
  totalAnswers: any = [];
  uniqueSelAnswer;
  multipleOpt: any = [];
  freeAnswer;
  relationAnswers: any = [];
  relOpt: any = [];
  inputsWhite: any = [];

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

  // id respuestas guardadas
  saveId;
  nextCount = 0;

  careerId;
  careerView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private exercService: ExercisesService,
    private careerServ: CarrerasService,
    private router: Router,
    private fireStore: AngularFirestore
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.exercId = this.activatedRoute.snapshot.params.exercId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    console.log(this.careerView);
    // console.log(
    //   `curso: ${this.idCurso} leccion: ${this.idLesson} carrera: ${this.careerId}`
    // );
    // console.log(
    //   `contenido: ${this.idContent} ejercicio: ${this.exercId} usuario: ${this.stdId}`
    // );
    this.noBackButton(true);
    window.addEventListener('beforeunload', this.getCloseEvent);
  }

  ngOnInit(): void {
    this.createSaveId();
    if (!this.careerView) {
      this.getCourseExercise();
    } else {
      this.getCareerExercise();
    }
  }

  ngOnDestroy(): void {
    // this.exerciseReceived.unsubscribe();
    this.noBackButton(false);
    this.endTempo = true;
    window.removeEventListener('beforeunload', this.getCloseEvent);
  }

  handleEditorInit(e): void {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  createSaveId(): void {
    this.saveId = this.fireStore.createId();
  }

  getCareerExercise(): void {
    const exerciseReceived = this.careerServ
      .exerciseDetail(this.careerId, this.exercId)
      .valueChanges()
      .subscribe((ex) => {
        const finishExams = this.exercService
          .getUserAnswers(this.careerId, this.exercId, this.stdId)
          .valueChanges()
          .subscribe((exams) => {
            // console.log(exams);
            this.exercise = ex;
            // console.log(ex);
            if (exams.length >= ex.intentos) {
              Swal.fire({
                icon: 'error',
                title: '!Error!',
                text: 'Ya realizó esta prueba.',
                confirmButtonText: 'cerrar',
              });
              this.getOutOfHere();
              finishExams.unsubscribe();
            } else {
              finishExams.unsubscribe();
              this.setTimer(ex);
              const questionsReceived = ex.preguntas;
              if (ex.seleccion === 2) {
                this.questions = this.sortArray(questionsReceived);
                this.sortRelationQuestions();
                this.setTotalAnswers();
              } else {
                this.questions = questionsReceived;
                this.sortRelationQuestions();
                this.setTotalAnswers();
              }
              this.loadQuestion();
              this.loadAnswers();
            }
          });
        exerciseReceived.unsubscribe();
      });
  }

  getCourseExercise(): void {
    const exerciseReceived = this.exercService
      .exerciseDetail(this.idCurso, this.exercId)
      .valueChanges()
      .subscribe((ex: any) => {
        const finishExams = this.exercService
          .getUserAnswers(this.idCurso, this.exercId, this.stdId)
          .valueChanges()
          .subscribe((exams) => {
            // console.log(exams);
            this.exercise = ex;
            // console.log(ex);
            if (exams.length >= ex.intentos) {
              Swal.fire({
                icon: 'error',
                title: '!Error!',
                text: 'Ya realizó esta prueba.',
                confirmButtonText: 'cerrar',
              });
              this.getOutOfHere();
              finishExams.unsubscribe();
            } else {
              finishExams.unsubscribe();
              this.setTimer(ex);
              const questionsReceived = ex.preguntas;
              if (ex.seleccion === 2) {
                this.questions = this.sortArray(questionsReceived);
                this.sortRelationQuestions();
                this.setTotalAnswers();
              } else {
                this.questions = questionsReceived;
                this.sortRelationQuestions();
                this.setTotalAnswers();
              }
              // console.log(this.questions);
              // this.totalAnswers.length = this.questions.length;
              // console.log(this.totalAnswers)
              this.loadQuestion();
              this.loadAnswers();
            }
          });
        exerciseReceived.unsubscribe();
      });
  }

  setTotalAnswers(): void {
    for (let index = 0; index < this.questions.length; index++) {
      this.totalAnswers.push({ index, valor: 0, visto: false });
    }
  }

  setTimer(ex): void {
    if (ex.duracion < 60) {
      this.date = new Date(`2021-01-01 00:${ex.duracion}:59`);
      // this.date = new Date('2021-01-01 00:00:10'); // para pruebas
    } else {
      this.date = new Date('2021-01-01 00:59:59');
    }
    this.startTempo();
  }

  // iniciar cronometro
  startTempo(): void {
    const interval = setInterval(() => {
      this.minutes = this.padLeft(this.date.getMinutes() + '');
      this.seconds = this.padLeft(this.date.getSeconds() + '');
      // console.log(this.minutes, this.seconds);
      this.date = new Date(this.date.getTime() - 1000);
      if (this.minutes === '00' && this.seconds === '00' && !this.endTempo) {
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

  // rellenar ceros
  padLeft(n): string {
    return '00'.substring(0, '00'.length - n.length) + n;
  }

  sortArray(arr): any {
    // barajar array
    // copia del array
    const array = arr.slice();
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
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

  // Barajar respuestas de preguntas de relacionar
  sortRelationQuestions(): void {
    this.questions.forEach((q) => {
      if (q.type === 4) {
        q.randomAnswers = this.sortArray(q.answers);
      }
    });
  }

  loadQuestion(): void {
    this.qType = this.questions[this.qNumber].type;
    // console.log(this.qType);
    this.uniqueSelAnswer = '';
    const ql = this.questions.length - 1;
    // console.log(`pregunta ${this.qNumber + 1} de ${ql + 1}`);
    if (this.qNumber <= ql && this.qNumber >= 0) {
      const question = this.questions[this.qNumber].question;
      // console.log(question);
      if (this.qType === 3) {
        const qDiv = document.getElementById('question');
        if (qDiv) {
          qDiv.innerHTML = this.questionFormatter(this.parseHTML(question));
        }
      } else {
        const qDiv = document.getElementById('question');
        if (qDiv) {
          qDiv.innerHTML = question;
        }
      }
    }
  }

  loadAnswers(): void {
    // console.log(this.questions[this.qNumber]);
    this.qType = this.questions[this.qNumber].type;
    if (this.totalAnswers[this.qNumber]?.visto) {
      if (this.qType === 1) {
        this.uniqueSelAnswer =
          this.totalAnswers[this.qNumber].posRespuestaSel + '';
      }
      if (this.qType === 2) {
        this.multipleOpt.length = 0;
        this.multipleOpt =
          this.totalAnswers[this.qNumber].opcionesEscogidas.slice();
      }
      if (this.qType === 3) {
        this.inputsWhite.length = 0;
        this.inputsWhite =
          this.totalAnswers[this.qNumber].opcionesEscogidas.slice();
        // console.log(this.inputsWhite);
      }
      if (this.qType === 4) {
        this.relOpt.length = 0;
        this.relOpt = this.totalAnswers[this.qNumber].opcionesEscogidas.slice();
      }
      if (this.qType === 5) {
        this.freeAnswer = '';
        this.freeAnswer = this.totalAnswers[this.qNumber].opcionesEscogidas;
      }
    } else {
      if (this.qType === 2) {
        this.multipleOpt.length = this.questions[this.qNumber].answers.length;
      }
    }
  }

  previousQuestion(): void {
    this.relationAnswers.length = 0;
    this.multipleOpt.length = 0;
    this.freeAnswer = '';
    if (this.qNumber > 0) {
      this.qNumber -= 1;
      this.testEnd = false;
      this.loadQuestion();
      this.loadAnswers();
    }
  }

  nextQuestion(): void {
    this.nextCount += 1;
    this.prepareQuestionByType();
    // Para pruebas descomentar la siguiente linea
    // y comentar las siguientes
    // this.advanceQuestion();

    if (this.nextCount === 1) {
      this.saveQuestion();
    } else {
      this.updateQuestion();
    }
  }

  prepareQuestionByType(): void {
    const qType = this.questions[this.qNumber].type;
    switch (qType) {
      case 2:
        this.saveMultipleAnswer();
        break;
      case 3:
        if (this.inputsWhite[0].answer) {
          this.saveWhiteAnswer();
        }
        break;
      case 4:
        if (this.relationAnswers[0]) {
          this.saveRelationAnswer();
        }
        break;
      case 5:
        if (this.freeAnswer) {
          this.saveFreeAnswer();
        }
        break;
      default:
        break;
    }
  }

  saveQuestion(): void {
    this.exercService
      .addUserAnswers(
        this.careerView ? this.careerId : this.idCurso,
        this.exercId,
        this.stdId,
        this.totalAnswers,
        this.saveId
      )
      .then(() => {
        this.advanceQuestion();
      })
      .catch((err) => console.log(err));
  }

  updateQuestion(): void {
    this.exercService
      .updateUserAnswers(
        this.careerView ? this.careerId : this.idCurso,
        this.exercId,
        this.stdId,
        this.totalAnswers,
        this.saveId
      )
      .then(() => {
        this.advanceQuestion();
      })
      .catch((err) => console.log(err));
  }

  advanceQuestion(): void {
    this.relationAnswers.length = 0;
    this.multipleOpt.length = 0;
    this.freeAnswer = '';
    if (this.qNumber < this.questions.length) {
      if (this.qNumber < this.questions.length - 1) {
        this.qNumber += 1;
        this.testEnd = false;
        this.loadQuestion();
        this.loadAnswers();
      } else {
        this.qNumber += 1;
        this.testEnd = true;
        // console.log(this.totalAnswers);
      }
    }
  }

  saveWhiteAnswer(): void {
    // console.log(this.questions[this.qNumber]);
    // console.log(this.inputsWhite);
    const a = this.getQuestionOptions(
      this.parseHTML(this.questions[this.qNumber].question)
    );
    // console.log(a);
    let cont = 0;
    let valor = 0;
    const opcionesEscogidas: any = [];
    this.inputsWhite.forEach((opt, index) => {
      opcionesEscogidas.push(opt);
      if (opt.answer?.toLowerCase() === a[index].toLowerCase()) {
        cont += 1;
      }
    });

    if (cont > 0) {
      valor = (cont / a.length) * 100;
    }

    const answer = {
      pregunta: this.parseHTML(this.questions[this.qNumber].question),
      respuestas: a,
      opcionesEscogidas,
      tipoPregunta: this.qType,
      valor,
      visto: true,
    };
    this.totalAnswers[this.qNumber] = answer;
    // console.log(this.totalAnswers);
  }

  saveMultipleAnswer(): void {
    // console.log(this.questions[this.qNumber].answers);
    // console.log(this.questions[this.qNumber].question);
    const respuestas: any = [];
    const opcionesEscogidas: any = [];
    for (
      let index = 0;
      index < this.questions[this.qNumber].answers.length;
      index++
    ) {
      if (this.multipleOpt[index]) {
        opcionesEscogidas.push(this.multipleOpt[index]);
      } else {
        opcionesEscogidas.push(false);
      }
    }
    let cont = 0;
    let valor = 0;
    opcionesEscogidas.forEach((o, index) => {
      respuestas.push({
        value: index + 1,
        respuesta: this.questions[this.qNumber].answers[index].answer,
        correcta: this.questions[this.qNumber].answers[index].respuesta,
      });
      if (this.questions[this.qNumber].answers[index].respuesta === o) {
        cont += 1;
      }

      if (cont > 0) {
        valor = (cont / this.questions[this.qNumber].answers.length) * 100;
      }
    });
    const answer = {
      pregunta: this.parseHTML(this.questions[this.qNumber].question),
      opcionesEscogidas,
      respuestas,
      respuestasorg: this.questions[this.qNumber].answers,
      tipoPregunta: this.qType,
      valor,
      visto: true,
    };
    this.totalAnswers[this.qNumber] = answer;
    // console.log(this.totalAnswers);
  }

  saveRelationAnswer(): void {
    let cont = 0;
    const respuestas = [];
    const opcionesEscogidas = [];
    this.relationAnswers.forEach((r) => {
      // console.log(r);
      respuestas.push(r);
      if (r.correct) {
        cont += 1;
      }
    });
    this.relOpt.forEach((o) => {
      opcionesEscogidas.push(o);
    });
    const answer = {
      pregunta: this.parseHTML(this.questions[this.qNumber].question),
      respuestas,
      tipoPregunta: this.qType,
      valor: Math.ceil((cont / this.relationAnswers.length) * 100),
      visto: true,
      opcionesEscogidas,
    };
    this.totalAnswers[this.qNumber] = answer;
    // console.log(this.totalAnswers);
  }

  saveFreeAnswer(): void {
    const answer = {
      pregunta: this.parseHTML(this.questions[this.qNumber].question),
      tipoPregunta: this.qType,
      valor: 0,
      visto: true,
      opcionesEscogidas: this.freeAnswer,
    };
    this.totalAnswers[this.qNumber] = answer;
    // console.log(this.totalAnswers);
  }

  // preguntas seleccionadas
  // seleccion unica:
  uniqueSelected(event: MatRadioChange): void {
    const pos = event.value - 1;
    const correctAnswer = this.questions[this.qNumber].answers.filter(
      (x) => x.respuesta === true
    );
    const selectedAnswer = this.questions[this.qNumber].answers[pos].answer;
    const correct = correctAnswer[0].answer === selectedAnswer ? true : false;
    const answer = {
      pregunta: this.parseHTML(this.questions[this.qNumber].question),
      respuestaCorrecta: this.parseHTML(correctAnswer[0].answer),
      respuestaSeleccionada: this.parseHTML(selectedAnswer),
      visto: true,
      correcta: correct,
      posRespuestaSel: event.value * 1,
      tipoPregunta: this.qType,
      valor: correct ? 100 : 0,
    };
    this.totalAnswers[this.qNumber] = answer;
    // console.log(this.totalAnswers);
  }

  // relacionar
  relationSelected(event: MatSelectChange, pos): void {
    // console.log(this.totalAnswers[this.qNumber].respuestas);
    if (!this.totalAnswers[this.qNumber].respuestas) {
      this.relationAnswers.length = this.questions[this.qNumber].answers.length;
    } else {
      this.relationAnswers = this.totalAnswers[this.qNumber].respuestas;
    }
    const answer = this.parseHTML(
      this.questions[this.qNumber].answers[pos].answer
    );
    const option = this.parseHTML(
      this.questions[this.qNumber].answers[pos].comment
    );
    const selOpt = this.parseHTML(
      this.questions[this.qNumber].randomAnswers[event.value.value - 1].comment
    );
    const correctoption = this.questions[this.qNumber].answers[pos].relation;
    const userOption =
      this.questions[this.qNumber].randomAnswers[event.value.value - 1]
        .relation;
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
      correct,
    };
    this.relationAnswers[pos] = userAnswer;
  }

  // *** Utilidades manejo de html

  parseAnswer(answer): string {
    const option = document.createElement('div');
    option.innerHTML = answer.answer;
    return option.textContent;
  }

  injectAnswerHtml(answer): void {
    const item = document.getElementById(`answer${answer.value}`);
    item.innerHTML = answer.answer;
  }

  injectRelationHtml(answer, n): void {
    // console.log(answer);
    const item = document.getElementById(`relation${n}`);
    item.innerHTML = answer.comment;
  }

  parseOption(answer): string {
    const option = document.createElement('div');
    option.innerHTML = answer.comment;
    return option.textContent;
  }

  parseHTML(html): string {
    const option = document.createElement('div');
    option.innerHTML = html;
    return option.textContent;
  }

  // limpiar preguntas rellenar blancos
  questionFormatter(question): string {
    let c = 0;
    this.inputsWhite.length = 0;
    let texto = question;

    while (texto.indexOf('[') !== -1) {
      const inicio = texto.indexOf('[');
      const final = texto.indexOf(']');
      const spaces = this.spaceGenerator(texto.substring(inicio, final + 1));
      texto = texto.replace(texto.substring(inicio, final + 1), spaces);
      c += 1;
      this.inputsWhite.push({ index: c });
    }
    // console.log(this.inputsWhite);
    return texto;
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

  spaceGenerator(word): string {
    let spaces = '';
    for (const iterator of word) {
      spaces += '_';
    }

    return spaces;
  }

  getQuestionOptions(question): any[] {
    const qOpt: any = [];
    let texto = question;

    while (texto.indexOf('[') !== -1) {
      const inicio = texto.indexOf('[');
      const final = texto.indexOf(']');
      const opt = texto.substring(inicio + 2, final - 1);
      texto = texto.replace(texto.substring(inicio, final + 1), 'spaces');
      qOpt.push(opt);
    }
    // console.log(qOpt);
    return qOpt;
  }

  // **** Fin de la prueba **** //
  finishTest(): void {
    if (!this.testEnd) {
      this.nextQuestion();
      this.qNumber = this.questions.length;
      this.testEnd = true;
    } else {
      let cont = 0;
      this.totalAnswers.forEach((q) => {
        if (q.index) {
          cont += 1;
        }
      });
      // console.log(cont)
      if (cont > 0) {
        Swal.fire({
          title: 'No ha terminado la prueba.',
          text: 'Faltan preguntas por contestar, ¿Esta seguro que desea salir?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro!',
        })
          .then((result) => {
            if (result.value) {
              this.goToFinish();
            }
          })
          .catch((error) => console.log(error));
      } else {
        Swal.fire({
          icon: 'success',
          title: '!Terminó la prueba!',
          text: 'Prueba terminada exitosamente.',
          confirmButtonText: 'cerrar',
        });
        this.goToFinish();
      }
    }
  }

  goToFinish(): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const lid = this.idLesson;
    const cntid = this.idContent;
    const exid = this.exercId;
    const stdid = this.stdId;
    const testId = this.saveId;
    if (!this.careerView) {
      this.router.navigate([
        `course-view/${cid}/${lid}/${stdid}/final-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}/${testId}`,
      ]);
    } else {
      this.router.navigate([
        `dashboard/final-evaluacion/${cid}/${stdid}/${exid}/${testId}`
      ]);
    }
  }
  // desactivar botón atrás
  noBackButton(state): void {
    window.location.hash = 'no-back-button';
    window.location.hash = 'Again-No-back-button'; // chrome
    window.onhashchange = () => {
      window.location.hash = 'no-back-button';
    };
    if (!state) {
      window.onhashchange = () => false;
    }
  }
  // controlar cierre
  getCloseEvent(event): void {
    event.preventDefault();
    const bool = event.returnValue;
    event.returnValue = bool;
    return event;
  }
  // validar si ya hizo la prueba
  getOutOfHere(): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const lid = this.idLesson;
    const sid = this.stdId;
    const exid = this.exercId;
    const cntid = this.idContent;
    if (!this.careerView) {
      this.router.navigate([
        `course-view/${cid}/${lid}/${sid}/evaluacion/${cid}/${lid}/${cntid}/${sid}`,
      ]);
    } else {
      this.router.navigate([
        `dashboard/evaluacion/${exid}/${sid}/${cid}`
      ]);
    }
  }

  goToQuestion(n): void {
    this.testEnd = false;
    this.qNumber = n;
    this.relationAnswers.length = 0;
    this.loadQuestion();
    this.loadAnswers();
  }
}
