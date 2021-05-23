import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject, Subject } from 'rxjs';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent implements OnInit, OnDestroy {

  courseId: string;
  exerciseId: string;

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
      state: false
    },
    {
      name: 'Selección multiple',
      img: '/assets/icons/respuesta_multiple.svg',
      value: 2,
      state: false
    },
    {
      name: 'Rellenar blancos',
      img: '/assets/icons/rellenar_blancos.svg',
      value: 3,
      state: false
    },
    {
      name: 'Relacionar',
      img: '/assets/icons/relacionar.svg',
      value: 4,
      state: false
    },
    {
      name: 'Respuesta libre',
      img: '/assets/icons/respuesta_libre.svg',
      value: 5,
      state: false
    }
  ]

  questions = [
    {
      value: 1,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
    },
    {
      value: 2,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
    },
    {
      value: 3,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
    },
    {
      value: 4,
      respuesta: false,
      punctuation: 0,
      answer: '',
      comment: '',
    }
  ]

  questionToSave = [];
  position: number;
  edit = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private exercService: ExercisesService,
    private router: Router,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
    console.log(this.exerciseId.length);
    if (this.exerciseId.substring(this.exerciseId.length - 5, this.exerciseId.length - 1) === 'edit'){
      this.edit = true;
      console.log(this.edit);
      this.exerciseId = this.exerciseId.substring(0, this.exerciseId.length - 5);
    }

    console.log(`Id curso: ${this.courseId}, Id Ejercicio: ${this.exerciseId}`);
    this.options[0].value = 1;
    this.options[0].state = true;

   }

  ngOnInit(): void {
    this.exerciseReceived = this.exercService.exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        this.questionToSave = ex.preguntas.slice();
        this.position = ex.preguntas.length + 1;
        console.log(this.position);
        console.log(this.questionToSave);
        
        console.log(this.options);
      })
  }

  ngOnDestroy(): void {
    this.exerciseReceived.unsubscribe();
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  selectionChange(event: MatRadioChange) {

    let pos;

    if (this.pivSelected) {
      pos = this.pivSelected - 1;
      this.options[pos].state = false;
    }
    this.pivSelected = this.selected;

    pos = event.value - 1;
    console.log(this.options[pos].name);
    this.options[pos].state = true;

  }

  trueSelected(event: MatRadioChange) {
    if (event.value) {
      let pos;
      console.log(`event value: ${event.value}`)
      if (this.pivTrueAnswer) {
        pos = this.pivTrueAnswer - 1;
        this.questions[pos].respuesta = false;
      }

      this.pivTrueAnswer = this.trueAnswer;

      pos = event.value -1;
      this.questions[pos].respuesta = true;
    }
  }

  addAnswer() {
    console.log(this.questions.length);
    const value = this.questions.length + 1;
    this.questions.push(
      {
        value: value,
        respuesta: false,
        punctuation: 0,
        answer: '',
        comment: '',
      }
    )
  }

  deleteAnswer() {
    if (this.questions.length > 2) {
      this.questions.pop();
    }

  }

  saveQuestion() {
    console.log(`respuesta verdadera: ${this.trueAnswer}`);
    if (!this.trueAnswer) {
      Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Debe establecer como verdadera al menos una respuesta.',
				confirmButtonText: 'cerrar',
			});
    } else {
      let validQ = true;
      this.questions.forEach(q => {
        if (!q.answer) {
          validQ = false;
        }
      })
      if (!validQ) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No deben quedar respuestas en blanco.',
          confirmButtonText: 'cerrar',
        });
      } else {
        this.questionToSave.push(
          {
            question: this.question,
            type: 1,
            answers: this.questions,
            position: this.position
          }
        );
        console.log(this.questionToSave);
        this.exercService.addQuestion(this.courseId, this.exerciseId, this.questionToSave)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'pregunta agregada exitosamente',
            confirmButtonText: 'cerrar',
          });
          this.router.navigate([`cursos/ejercicios/${this.courseId}/questions/${this.exerciseId}`]);
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'error',
            text: 'Ocurrió un error' + error,
            confirmButtonText: 'cerrar',
                });
            });
      }
    }
  }

}
