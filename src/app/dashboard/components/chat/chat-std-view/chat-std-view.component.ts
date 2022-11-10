import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { UsersService } from '../../../../core/services/users/users.service';
import Swal from 'sweetalert2';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { MailService } from 'src/app/core/services/mail/mail.service';

@Component({
  selector: 'app-chat-std-view',
  templateUrl: './chat-std-view.component.html',
  styleUrls: ['./chat-std-view.component.scss'],
})
export class ChatStdViewComponent implements OnInit, OnDestroy {
  courseId;
  stdId;
  dataPregunta: any = {};
  form: FormGroup;
  preguntasSubscribe;
  preguntas;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private mailService: MailService,
    private router: Router
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.buildForm();
    console.log('curso id: ' + this.courseId);
    console.log('std id: ' + this.stdId);
  }

  ngOnInit(): void {
    this.getCourseInfo();
    this.getStdQuestions();
  }

  ngOnDestroy(): void {
    if (this.preguntasSubscribe) {
      this.preguntasSubscribe.unsubscribe();
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      pregunta: ['', Validators.required],
    });
  }

  get preguntaField(): AbstractControl {
    return this.form.get('pregunta');
  }

  getCourseInfo(): void {
    const infoCurso = this.courseService
      .detailCourse(this.courseId)
      .valueChanges()
      .subscribe((curso) => {
        this.dataPregunta.idCurso = curso.id;
        this.dataPregunta.nombreCurso = curso.nombre;
        this.dataPregunta.profesor = curso.profesor;
        this.getTeacherInfo(curso.profesor);
        this.getStdInfo();
        infoCurso.unsubscribe();
      });
  }

  getTeacherInfo(profe: string): void {
    let correo = '';
    const teacherInfo = this.userService
      .listTeachers()
      .valueChanges()
      .subscribe((profes) => {
        profes.forEach((profesor) => {
          if (profesor.nombres + ' ' + profesor.apellidos === profe) {
            correo = profesor.correo;
            this.dataPregunta.correoProfesor = correo;
          }
        });
        teacherInfo.unsubscribe();
      });
  }

  getStdInfo(): void {
    const stdInfo = this.userService
      .detailUser(this.stdId)
      .valueChanges()
      .subscribe((std) => {
        this.dataPregunta.estudiante = std.nombres + ' ' + std.apellidos;
        this.dataPregunta.idEstudiante = std.id;
        this.dataPregunta.correoEstudiante = std.correo;
        stdInfo.unsubscribe();
      });
  }

  getStdQuestions(): void {
    this.preguntasSubscribe = this.chatService
      .getStdQuestions(this.courseId, this.stdId)
      .valueChanges()
      .subscribe((preguntas) => {
        this.orderQuestions(preguntas);
        preguntas.forEach((pregunta) => {
          if (pregunta.fechaPregunta) {
            pregunta.fechaPregunta = this.formatDate(pregunta.fechaPregunta);
          }
          this.getQuestionAnswers(pregunta);
        });
        this.preguntas = preguntas;
      });
  }

  orderQuestions(preguntas: any): void {
    preguntas = preguntas.sort((a, b) => {
      if (a.fechaPregunta < b.fechaPregunta) {
        return 1;
      }

      if (a.fechaPregunta > b.fechaPregunta) {
        return -1;
      }

      return 0;
    });
  }

  getQuestionAnswers(pregunta: any): void {
    const respuestas = this.chatService
      .getQuestionAnswers(this.courseId, pregunta.id)
      .valueChanges()
      .subscribe((answers) => {
        answers.forEach(resp => {
          resp.fechaRespuesta = this.formatDate(resp.fechaRespuesta);
        });
        pregunta.respuestas = answers;
        respuestas.unsubscribe();
      });
  }

  saveQuestion(event: Event): void {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // this.form.disable();
      this.saveStdQuestion();
    }
  }

  saveStdQuestion(): void {
    this.dataPregunta.pregunta = this.form.value.pregunta;
    console.log(this.dataPregunta);
    this.chatService
      .addQuestion(this.dataPregunta)
      .then(() => {
        Swal.fire({
          icon: 'success',
          text: 'Pregunta enviada.',
          confirmButtonText: 'Aceptar',
        });
        this.enviarCorreoProfesor();
        this.form.reset();
      })
      .catch((err) => console.log(err));
  }

  async enviarCorreoProfesor(): Promise<void> {
    const data = this.dataPregunta;
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data));
    await this.mailService
      .chatToTeacher(data)
      .toPromise()
      .then(
        () => {
          console.log(`mail enviado a ${this.dataPregunta.profesor}`);
        },
        (e) => {
          console.log(e);
        }
      );
  }

  questionDelete(element): void {
    Swal.fire({
      title: '¿Esta seguro?',
      icon: 'warning',
      text: 'Al borrar esta pregunta, no puede ser recuperada, el profesor no podrá contestarla.',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.chatService.deleteQuestion(element.idCurso, element.id)
            .then(() => {
              Swal.fire(
                'Exito',
                `Pregunta eliminada.`,
                'success'
              );
            })
            .catch((err) => {
              Swal.fire(
                'Error',
                `No se pudó eliminar la pregunta. ${err}.`,
                'error'
              );
            });
        }
      })
      .catch((err) => console.log(err));
  }

  goBack(): void {
    this.router.navigate([`cursos/index/${this.courseId}/${this.stdId}`]);
  }

  formatDate(date): string {
    const ultimoIngreso = new Date(date.seconds * 1000);
    return ultimoIngreso.toLocaleString();
  }
}
