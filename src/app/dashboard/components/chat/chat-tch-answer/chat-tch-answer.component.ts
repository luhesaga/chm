import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { MailService } from 'src/app/core/services/mail/mail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-tch-answer',
  templateUrl: './chat-tch-answer.component.html',
  styleUrls: ['./chat-tch-answer.component.scss']
})
export class ChatTchAnswerComponent implements OnInit, OnDestroy {

  courseId;
  questionId;

  pregunta;
  preguntaSubscribe;
  respuestaSubscribe;

  form: FormGroup;


  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private mailService: MailService,
    private router: Router,
  ) {
    this.buildForm();
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.questionId = this.activatedRoute.snapshot.params.questionId;
    console.log('curso id: ' + this.courseId);
    console.log('question id: ' + this.questionId);
  }

  ngOnInit(): void {
    this.getQuestion();
  }

  ngOnDestroy(): void {
    if (this.preguntaSubscribe) {
      this.preguntaSubscribe.unsubscribe();
    }
    if (this.respuestaSubscribe) {
      this.respuestaSubscribe.unsubscribe();
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      respuesta: ['', Validators.required],
    });
  }

  get respuestaField(): AbstractControl {
    return this.form.get('respuesta');
  }

  getQuestion(): void {
    this.preguntaSubscribe = this.chatService.getQuestion(this.courseId, this.questionId)
      .valueChanges()
      .subscribe(pregunta => {
        this.getAnswersQuestions(pregunta);
        pregunta.fechaPregunta = this.formatDate(pregunta.fechaPregunta);
        this.pregunta = pregunta;
      });
  }

  getAnswersQuestions(pregunta: any): void {
    this.respuestaSubscribe = this.chatService.getQuestionAnswers(this.courseId, this.questionId)
      .valueChanges()
      .subscribe(respuestas => {
        respuestas.forEach(respuesta => {
          respuesta.fechaRespuesta = this.formatDate(respuesta.fechaRespuesta);
        });
        pregunta.respuestas = respuestas;
      });
  }

  saveAnswer(event: Event): void {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // this.form.disable();
      this.saveTchAnswer();
    }
  }

  saveTchAnswer(): void {
    this.chatService.addAnswer(this.courseId, this.questionId, this.form.value.respuesta)
      .then(() => {
        this.chatService.markAsAnswered(this.courseId, this.questionId)
          .then(() => {
            Swal.fire({
              icon: 'success',
              text: 'Respuesta enviada.',
              confirmButtonText: 'Aceptar',
            });
            this.enviarCorreoEstudiante();
            this.respuestaField.setValue('');
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  async enviarCorreoEstudiante(): Promise<void> {
    const data = this.pregunta;
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data));
    await this.mailService
      .chatToStudent(data)
      .toPromise()
      .then(
        () => {
          console.log(`mail enviado a ${this.pregunta.estudiante}`);
        },
        (e) => {
          console.log(e);
        }
      );
  }

  answerDelete(element): void {
    Swal.fire({
      title: '¿Esta seguro?',
      icon: 'warning',
      text: 'Al borrar esta respuesta, no puede ser recuperada, el estudiante no podrá verla.',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.chatService.deleteAnswer(this.courseId, this.questionId, element.id)
            .then(() => {
              Swal.fire(
                'Exito',
                `Respuesta eliminada.`,
                'success'
              );
            })
            .catch((err) => {
              Swal.fire(
                'Error',
                `No se pudó eliminar la respuesta. ${err}.`,
                'error'
              );
            });
        }
      })
      .catch((err) => console.log(err));
  }

  goBack(): void {
    this.router.navigate([`cursos/chat-adm/${this.courseId}`]);
  }

  formatDate(date): string {
    const ultimoIngreso = new Date(date.seconds * 1000);
    return ultimoIngreso.toLocaleString();
  }

}
