import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject, Subject } from 'rxjs';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss'],
})
export class QuestionCreateComponent implements OnInit, OnDestroy {
  courseId: string;
  exerciseId: string;
  careerId: string;
  careerView = false;

  exerciseReceived;

  private editorSubject: Subject<any> = new AsyncSubject();

  selected: number;
  pivSelected: number;
  question;
  trueAnswer: number;
  pivTrueAnswer: number;

  options = [
    {
      name: 'Selección única',
      img: '/assets/icons/respuesta_unica.svg',
      value: 1,
      state: false,
    },
    {
      name: 'Selección multiple',
      img: '/assets/icons/respuesta_multiple.svg',
      value: 2,
      state: false,
    },
    {
      name: 'Rellenar blancos',
      img: '/assets/icons/rellenar_blancos.svg',
      value: 3,
      state: false,
    },
    {
      name: 'Relacionar',
      img: '/assets/icons/relacionar.svg',
      value: 4,
      state: false,
    },
    {
      name: 'Respuesta libre',
      img: '/assets/icons/respuesta_libre.svg',
      value: 5,
      state: false,
    },
    {
      name: 'Tarea',
      img: '/assets/icons/tarea.png',
      value: 6,
      state: false,
    },
  ];

  questions = [
    {
      value: 1,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
      relation: 0,
    },
    {
      value: 2,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
      relation: 0,
    },
    {
      value: 3,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
      relation: 0,
    },
    {
      value: 4,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
      relation: 0,
    },
  ];

  relations = [
    {
      value: 1,
      answer: '',
    },
    {
      value: 2,
      answer: '',
    },
    {
      value: 3,
      answer: '',
    },
    {
      value: 4,
      answer: '',
    },
  ];

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

  whitePiv = false;
  whiteWord: '';
  whiteWords = [];

  questionToSave = [];
  position: number;

  // editar pregunta
  edit = false;
  qType: number;
  qPos: number;
  questionToEdit;
  AnswerTruePos: number;

  // tarea
  tarea;
  jobExpDateCheck;
  jobExpDate;
  jobExpTime;
  jobFinalDateCheck;
  jobFinalDate;
  jobFinalTime;
  documentType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private exercService: ExercisesService,
    private careerService: CarrerasService,
    private router: Router
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
    this.qType = this.activatedRoute.snapshot.params.questionType;
    this.qPos = this.activatedRoute.snapshot.params.questionPosition;
    this.AnswerTruePos = this.activatedRoute.snapshot.params.answerTrue;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }

    if (this.qPos) {
      this.edit = true;
    }
    console.log(this.careerView);
  }

  ngOnInit(): void {
    if (!this.careerView) {
      this.getCourseExercises();
    } else {
      this.getCareerExercises();
    }
  }

  ngOnDestroy(): void {
    if (this.exerciseReceived) {
      this.exerciseReceived.unsubscribe();
    }
  }

  handleEditorInit(e): void {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  getCourseExercises(): void {
    this.exerciseReceived = this.exercService
      .exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        if (ex) {
          if (ex.preguntas) {
            this.questionToSave = ex.preguntas.slice();
            this.position = ex.preguntas.length + 1;
          } else {
            this.position = 1;
          }
        } else {
          this.position = 1;
        }

        if (this.edit) {
          this.getEditData(ex);
        }
      });
  }

  getCareerExercises(): void {
    this.exerciseReceived = this.careerService
      .exerciseDetail(this.careerId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        if (ex) {
          if (ex.preguntas) {
            this.questionToSave = ex.preguntas.slice();
            this.position = ex.preguntas.length + 1;
          } else {
            this.position = 1;
          }
        } else {
          this.position = 1;
        }
        if (this.edit) {
          this.getEditData(ex);
        }
      });
  }

  getEditData(ex): void {
    const optPos = this.qType - 1;
    const qPos = this.qPos - 1;
    this.trueAnswer = this.AnswerTruePos;
    this.pivTrueAnswer = this.trueAnswer;
    this.options[optPos].state = true;
    this.questionToEdit = ex.preguntas.slice()[qPos];
    this.selected = this.qType;
    this.pivSelected = this.qType;
    this.question = this.questionToEdit.question;
    if (this.qType * 1 !== 5) {
      this.questions.length = 0;
      this.questions = this.questionToEdit.answers;
    }
    // validar si es pregunta de tipo relacionar (tipo 4)
    if (this.qType * 1 === 4) {
      this.relations.length = 0;
      this.questions.forEach((q) => {
        this.relations.push({
          value: q.relation,
          answer: q.comment,
        });
      });
      // ordenar el array
      this.relations.sort((a, b) =>
        a.value > b.value ? 1 : b.value > a.value ? -1 : 0
      );
    }
    // actualizar palabras si es rellenar blancos
    if (this.qType * 1 === 3) {
      this.questionChange(this.question);
    }
    // tareas
    if (this.qType * 1 === 6) {
      console.log(ex.preguntas[0].tarea);
      this.jobExpDateCheck = ex.preguntas[0].tarea.vencimiento;
      this.jobExpDate = ex.preguntas[0].tarea.fechaVencimiento;
      this.jobExpTime = ex.preguntas[0].tarea.horaVencimiento;
      this.jobFinalDateCheck = ex.preguntas[0].tarea.final;
      this.jobFinalDate = ex.preguntas[0].tarea.fechaFinal;
      this.jobFinalTime = ex.preguntas[0].tarea.horaFinal;
      this.documentType = ex.preguntas[0].tarea.tipoDocumento.toString();
    }
  }

  selectionChange(event: MatRadioChange): void {
    let pos;

    if (this.pivSelected) {
      pos = this.pivSelected - 1;
      this.options[pos].state = false;
    }
    this.pivSelected = this.selected;

    pos = event.value - 1;
    this.options[pos].state = true;
  }

  trueSelected(event: MatRadioChange): void {
    if (event.value) {
      let pos;

      if (this.pivTrueAnswer) {
        pos = this.pivTrueAnswer - 1;
        this.questions[pos].respuesta = false;
      }

      this.pivTrueAnswer = this.trueAnswer;

      pos = event.value - 1;
      this.questions[pos].respuesta = true;
    }
  }

  relationSelect(event, question): void {
    const posQ = question - 1;
    this.questions[posQ].relation = event.value;
  }

  saveRelations(): void {
    let validR = false;
    let validR2 = false;
    this.relations.forEach((r) => {
      if (!r.answer) {
        validR = true;
      }
    });
    if (validR) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Faltan respuestas de relación por completar.',
        confirmButtonText: 'cerrar',
      });
    } else {
      this.questions.forEach((q) => {
        if (q.relation === 0 || !q.relation) {
          validR2 = true;
        } else {
          q.comment = this.relations[q.relation - 1].answer;
        }
      });
      if (validR2) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No ha relacionado todas las respuestas.',
          confirmButtonText: 'cerrar',
        });
      } else {
        if (this.edit) {
          this.editQuestion();
        } else {
          this.saveQuestion();
        }
      }
    }
  }

  saveFreeAnswer(): void {
    this.questions.length = 0;
    if (this.edit) {
      this.editQuestion();
    } else {
      this.saveQuestion();
    }
  }

  saveWhite(): void {
    this.questions.length = 0;
    if (this.edit) {
      this.editQuestion();
    } else {
      this.saveQuestion();
    }
  }

  saveJob(): void {
    let val = true;
    this.tarea = {
      vencimiento: this.jobExpDateCheck === true ? true : false,
      fechaVencimiento: this.jobExpDateCheck === true ? this.jobExpDate : '',
      horaVencimiento: this.jobExpDateCheck === true ? this.jobExpTime : '',
      final: this.jobFinalDateCheck === true ? true : false,
      fechaFinal: this.jobFinalDateCheck === true ? this.jobFinalDate : '',
      horaFinal: this.jobFinalDateCheck === true ? this.jobFinalTime : '',
      tipoDocumento: this.documentType * 1,
    };

    if (this.tarea.vencimiento) {
      if (!this.tarea.fechaVencimiento || !this.tarea.horaVencimiento) {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Debe establecer la fecha y hora de vencimiento.',
          confirmButtonText: 'cerrar',
        });
        val = false;
      }
    }

    if (this.tarea.final) {
      if (!this.tarea.fechaFinal || !this.tarea.horaFinal) {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Debe establecer la fecha y hora de finalización.',
          confirmButtonText: 'cerrar',
        });
        val = false;
      }
    }

    if (!this.tarea.tipoDocumento) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: 'Debe establecer el tipo de documento.',
        confirmButtonText: 'cerrar',
      });
      val = false;
    }

    if (val) {
      this.questions.length = 0;
      if (this.edit) {
        this.editQuestion();
      } else {
        this.saveQuestion();
      }
    }
  }

  saveOrEditQuestion(): void {
    if (this.edit) {
      this.editQuestion();
    } else {
      this.saveQuestion();
    }
  }

  saveQuestion(): void {
    if (this.questionValidator()) {
      this.questionToSave.push({
        question: this.question,
        type: this.selected * 1,
        answers: this.questions,
        position: this.position,
        tarea: this.tarea ? this.tarea : '',
      });
      console.log(this.questionToSave);
      if (!this.careerView) {
        this.saveCourseQuestion();
      } else {
        this.saveCareerQuestion();
      }
    }
  }

  saveCourseQuestion(): void {
    this.exercService
      .addQuestion(this.courseId, this.exerciseId, this.questionToSave)
      .then(() => {
        this.successMessage('create');
        this.goBack();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  saveCareerQuestion(): void {
    this.careerService
      .addQuestion(this.careerId, this.exerciseId, this.questionToSave)
      .then(() => {
        this.successMessage('create');
        this.goBack();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  editQuestion(): void {
    if (this.questionValidator()) {
      this.questionToEdit.question = this.question;
      this.questionToEdit.answers = this.questions;
      this.questionToEdit.type = this.selected * 1;
      this.questionToEdit.tarea = this.tarea ? this.tarea : '';

      const pos = this.questionToEdit.position - 1;
      this.questionToSave[pos] = this.questionToEdit;

      if (!this.careerView) {
        this.editCourseQuestion();
      } else {
        this.editCareerQuestion();
      }
    }
  }

  editCourseQuestion(): void {
    this.exercService
      .addQuestion(this.courseId, this.exerciseId, this.questionToSave)
      .then(() => {
        this.successMessage('edit');
        this.goBack();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  editCareerQuestion(): void {
    this.careerService
      .addQuestion(this.careerId, this.exerciseId, this.questionToSave)
      .then(() => {
        this.successMessage('edit');
        this.goBack();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  successMessage(action: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Exito!',
      text: `pregunta ${
        action === 'create' ? 'agregada' : 'actualizada'
      } exitosamente`,
      confirmButtonText: 'cerrar',
    });
  }

  errorMessage(error: string): void {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Ocurrió un error' + error,
      confirmButtonText: 'cerrar',
    });
  }

  questionValidator(): boolean {
    let validation = true;

    if (!this.trueAnswer && this.selected * 1 === 1) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe establecer como verdadera al menos una respuesta.',
        confirmButtonText: 'cerrar',
      });
      validation = false;
    }

    if (this.selected * 1 === 2) {
      let validator = false;
      this.questions.forEach((q) => {
        if (q.respuesta === true) {
          validator = true;
        }
      });

      if (!validator) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe establecer como verdadera al menos una respuesta.',
          confirmButtonText: 'cerrar',
        });
        validation = false;
      }
    }

    let validQ = true;
    this.questions.forEach((q) => {
      if (!q.answer) {
        validQ = false;
      }
    });

    if (!validQ && (this.selected * 1 === 1 || this.selected * 1 === 2)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No deben quedar respuestas en blanco.',
        confirmButtonText: 'cerrar',
      });
      validation = false;
    }

    return validation;
  }

  addAnswer(): void {
    const value = this.questions.length + 1;
    this.questions.push({
      value,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
      relation: 0,
    });

    if (this.qType * 1 === 4 || this.selected * 1 === 4) {
      const v = this.relations.length + 1;
      this.relations.push({
        value: v,
        answer: '',
      });
    }
  }

  deleteAnswer(): void {
    if (this.questions.length > 2) {
      this.questions.pop();
      if (this.qType * 1 === 4 || this.selected * 1 === 4) {
        this.relations.pop();
      }
    }
  }

  questionChange(event): void {
    const t = document.createElement('template');
    t.innerHTML = event;

    let texto = '';

    if (t.innerHTML) {
      texto = t.content.firstChild.textContent;
      const word = texto.split(/(?:\[|\])+/);
      this.whitesGenerator(word);
    }
  }

  whitesGenerator(array): void {
    this.whiteWords.length = 0;
    array.forEach((p) => {
      if (p.indexOf('{') !== -1 && p.indexOf('}') !== -1) {
        this.whiteWords.push(p.substring(1, p.length - 1));
      }
    });
  }

  questionFormatter(): string {
    let texto = this.question;

    while (texto.indexOf('[') !== -1) {
      const inicio = texto.indexOf('[');
      const final = texto.indexOf(']');
      const spaces = this.spaceGenerator(texto.substring(inicio, final + 1));
      texto = texto.replace(texto.substring(inicio, final + 1), spaces);
    }

    return texto;
  }

  spaceGenerator(word): string {
    let spaces = '';

    for (const iterator of word) {
      spaces += '_';
    }
    // for (let index = 0; index < word.length; index++) {
    //   spaces += '_';
    // }

    return spaces;
  }

  goBack(): void {
    if (!this.careerView) {
      this.router.navigate([
        `cursos/ejercicios/${this.courseId}/questions/${this.exerciseId}`,
      ]);
    } else {
      this.router.navigate([
        `cursos/ejercicios-carrera/${this.careerId}/questions/${this.exerciseId}`,
      ]);
    }
  }
}
