import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { ForumService } from 'src/app/core/services/forums/forum.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MailService } from '../../../core/services/mail/mail.service';

@Component({
  selector: 'app-reply-foro',
  templateUrl: './reply-foro.component.html',
  styleUrls: ['./reply-foro.component.scss'],
})
export class ReplyForoComponent implements OnInit {
  idCurso: string;
  idLesson: string;
  idContent: string;
  idReplyForo: string;
  stdId: string;

  tipo: string;
  answer: string;

  contenido: any;

  qualifyAnswer = true;
  userQualifyAnswers: any;

  profesor: string;
  mailProfesor: string;
  calificacionManual = false;
  nombreCurso: string;

  constructor(
    private router: Router,
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private foroService: ForumService,
    private courseService: CourseService,
    private userService: UsersService,
    private mailService: MailService,
  ) {
    this.contenido = {};
    this.tipo = this.activatedRoute.snapshot.params.tipo;
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.idReplyForo = this.activatedRoute.snapshot.params.idReplayForo;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    // console.log(`tipo: ${this.tipo}`);
    // console.log(`curso: ${this.idCurso}`);
    // console.log(`leccion: ${this.idLesson}`);
    // console.log(`contenido: ${this.idContent}`);
    // console.log(`reply: ${this.idReplyForo}`);
  }

  ngOnInit(): void {
    this.getTeacherInfo();
    this.getUserAnswers();
    if (
      !(
        this.tipo === 'responder' ||
        this.tipo === 'citar' ||
        this.tipo === 'editar'
      )
    ) {
      this.goToLogin();
    }
    if (this.idReplyForo) {
      this.obtenerRespuestaForo();
    } else {
      this.obtenerContenido();
    }
  }

  getTeacherInfo(): void {
    const cursoLeccion = this.courseService
      .detailCourse(this.idCurso)
      .valueChanges()
      .subscribe((curso) => {
        this.nombreCurso = curso.nombre;
        this.profesor = curso.profesor;
        const teachersList = this.userService
          .listTeachers()
          .valueChanges()
          .subscribe((teachers) => {
            this.mailProfesor = 'no definido';
            teachers.forEach((teacher) => {
              if (teacher.nombres + ' ' + teacher.apellidos === this.profesor) {
                this.mailProfesor = teacher.correo;
              }
            });
            // console.log('profesor: ' + this.profesor);
            // console.log('mail profesor: ' + this.mailProfesor);
            teachersList.unsubscribe();
          });
        cursoLeccion.unsubscribe();
      });
  }

  getUserAnswers(): void {
    const userAnswers = this.foroService
      .getUserAnswers(this.idCurso, this.idLesson, this.idContent, this.stdId)
      .valueChanges()
      .subscribe((ans) => {
        if (ans.length > 0) {
          this.qualifyAnswer = false;
          this.userQualifyAnswers = ans;
        }
        userAnswers.unsubscribe();
      });
  }

  obtenerContenido(): void {
    this.lessonService
      .lessonContentDetail(this.idCurso, this.idLesson, this.idContent)
      .valueChanges()
      .subscribe((contenido: any) => {
        this.contenido = contenido;
        if (!this.contenido) {
          this.goToLogin();
        }
        if (contenido.foroTipoCalificacion === 'Manual') {
          this.calificacionManual = true;
        }
      });
  }

  obtenerRespuestaForo(): void {
    this.lessonService
      .getReplyForo(
        this.idCurso,
        this.idLesson,
        this.idContent,
        this.idReplyForo
      )
      .valueChanges()
      .subscribe((foro) => {
        this.contenido = foro;
        this.showReplyForo(foro);
        if (!this.contenido) {
          this.goToLogin();
        }
      });
  }

  showReplyForo(foro: any): void {
    if (this.tipo === 'editar') {
      this.answer = foro.contenido;
    }
  }

  enviarForo(): void {
    let usuario: any;
    const subUsuario = this.auth.user$.subscribe((u) => {
      usuario = u;
      const data = {
        tiempo: new Date(),
        tipo: this.tipo,
        contenido: this.answer,
        nombreCompleto: usuario.nombres + ' ' + usuario.apellidos,
        id: usuario.id,
        calificacion: this.calificacionManual ? 0 : 100,
      };
      this.lessonService.pushForo(
        data,
        this.idCurso,
        this.idLesson,
        this.idContent
      );
      if (this.qualifyAnswer) {
        this.foroService.forumAnswer(
          data,
          this.idCurso,
          this.idLesson,
          this.idContent
        );
      }
      if (this.calificacionManual && this.qualifyAnswer) {
        console.log('enviando correo al profe...');
        this.enviarCorreoProfesor(data);
      }
      subUsuario.unsubscribe();
      this.goToForo();
    });
  }

  async enviarCorreoProfesor(data: any): Promise<void> {
    const dataCorreo = {
      profesor: this.profesor,
      mailProfesor: this.mailProfesor,
      estudiante: data.nombreCompleto,
      foro: this.contenido.titulo,
      curso: this.nombreCurso
    };

    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(dataCorreo));
    await this.mailService
      .forumRevition(dataCorreo)
      .toPromise()
      .then(
        () => {
          console.log(`mail enviado a ${this.profesor}`);
        },
        (e) => {
          console.log(e);
        }
      );
  }

  enviarComentario(): void {
    let usuario: any;
    const subUsuario = this.auth.user$.subscribe((u) => {
      usuario = u;
      const data = {
        tiempo: new Date(),
        tipo: this.tipo,
        contenido: this.answer,
        nombreCompleto: usuario.nombres + ' ' + usuario.apellidos,
        idUsuario: usuario.id,
      };
      this.lessonService.pushComentario(
        data,
        this.idCurso,
        this.idLesson,
        this.idContent,
        this.idReplyForo
      );
      if (this.qualifyAnswer) {
        this.foroService.forumAnswer(
          data,
          this.idCurso,
          this.idLesson,
          this.idContent
        );
      }
      this.goToForo();
      subUsuario.unsubscribe();
    });
  }

  editarForo(): void {
    this.lessonService
      .editarForo(
        this.answer,
        this.idCurso,
        this.idLesson,
        this.idContent,
        this.idReplyForo
      )
      .catch(() => console.log('error al editar foro'))
      .then(() => {
        this.foroService.getDetailAnswer(
          this.idCurso,
          this.idLesson,
          this.idContent,
          this.stdId,
          this.idReplyForo
        );
        if (!this.qualifyAnswer) {
          this.foroService.editForumAnswer(
            this.answer,
            this.idCurso,
            this.idLesson,
            this.idContent,
            this.stdId,
            this.userQualifyAnswers[0].id
          );
        }
        this.goToForo();
      });
  }

  goToForo(): void {
    this.router.navigateByUrl(
      `course-view/${this.idCurso}/${this.idLesson}/${this.stdId}/foro/${this.idCurso}/${this.idLesson}/${this.idContent}/${this.stdId}`
    );
  }

  goToLogin(): void {
    this.router.navigateByUrl('login');
  }
}
