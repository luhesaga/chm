import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ForumService } from 'src/app/core/services/forums/forum.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-reply-foro',
  templateUrl: './reply-foro.component.html',
  styleUrls: ['./reply-foro.component.scss']
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

  constructor(
    private router: Router,
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private foroService: ForumService,
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
    this.getUserAnswers();
    if (!(this.tipo === 'responder'
      || this.tipo === 'citar'
      || this.tipo === 'editar')) {
      this.goToLogin()
    }
    if (this.idReplyForo) {
      this.obtenerRespuestaForo();
    }
    else {
      this.obtenerContenido();
    }
  }

  getUserAnswers() {
    let userAnswers = this.foroService.getUserAnswers(this.idCurso, this.idLesson, this.idContent, this.stdId)
      .valueChanges()
      .subscribe(ans => {
        if (ans.length > 0) {
          this.qualifyAnswer = false;
          this.userQualifyAnswers = ans;
        }
        // console.log(this.qualifyAnswer);
        userAnswers.unsubscribe();
      })
  }

  obtenerContenido(): void {
    this.lessonService.lessonContentDetail(this.idCurso, this.idLesson, this.idContent)
      .valueChanges()
      .subscribe(contenido => {
        this.contenido = contenido
        if (!this.contenido) {
          this.goToLogin();
        }
      })
  }

  obtenerRespuestaForo() {
    this.lessonService.getReplyForo(this.idCurso, this.idLesson, this.idContent, this.idReplyForo)
      .valueChanges()
      .subscribe(foro => {
        this.contenido = foro;
        this.showReplyForo(foro);
        if (!this.contenido) {
          this.goToLogin();
        }
      });
  }

  showReplyForo(foro: any) {
    if (this.tipo === 'editar') {
      this.answer = foro.contenido;
    }
  }

  enviarForo(): void {
    let usuario: any;
    const subUsuario = this.auth.user$.subscribe(u => {
      usuario = u;
      const data = {
        tiempo: new Date(),
        tipo: this.tipo,
        contenido: this.answer,
        nombreCompleto: usuario.nombres + ' ' + usuario.apellidos,
        id: usuario.id,
      }
      this.lessonService.pushForo(data, this.idCurso, this.idLesson, this.idContent);
      if (this.qualifyAnswer) {
        this.foroService.forumAnswer(data, this.idCurso, this.idLesson, this.idContent);
      }
      subUsuario.unsubscribe();
      this.goToForo();
    })
  }

  enviarComentario() {
    let usuario: any;
    const subUsuario = this.auth.user$.subscribe(u => {
      usuario = u;
      const data = {
        tiempo: new Date(),
        tipo: this.tipo,
        contenido: this.answer,
        nombreCompleto: usuario.nombres + ' ' + usuario.apellidos,
        idUsuario: usuario.id,
      }
      this.lessonService.pushComentario(data, this.idCurso, this.idLesson, this.idContent, this.idReplyForo);
      if (this.qualifyAnswer) {
        this.foroService.forumAnswer(data, this.idCurso, this.idLesson, this.idContent);
      }
      this.goToForo();
      subUsuario.unsubscribe();
    })
  }

  editarForo() {
    this.lessonService.editarForo(this.answer, this.idCurso, this.idLesson, this.idContent, this.idReplyForo)
      .catch(() => console.log('error al editar foro'))
      .then(() => {
        this.foroService.getDetailAnswer(this.idCurso, this.idLesson, this.idContent, this.stdId, this.idReplyForo)
        if (!this.qualifyAnswer) {
          this.foroService.editForumAnswer(this.answer, this.idCurso, this.idLesson, this.idContent, this.stdId, this.userQualifyAnswers[0].id);
        }
        this.goToForo()
      });
  }

  goToForo() {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/${this.stdId}/foro/${this.idCurso}/${this.idLesson}/${this.idContent}/${this.stdId}`)
  }

  goToLogin() {
    this.router.navigateByUrl('login')
  }
}
