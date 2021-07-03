import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss']
})
export class ForoComponent implements OnInit, DoCheck {

  idCurso:string;
  idLesson:string;
  idContent:string;

  contenido:any;

  respuestas:any;

  usuario:any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.usuario ={};
    this.respuestas= [];
    this.contenido={};
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent= this.activatedRoute.snapshot.params.idContent;
    this.obtenerContenido();
    this.usuarioLoggeado();
  }

  ngDoCheck():void
  {
    const idContent= this.activatedRoute.snapshot.params.idContent;
    if(idContent !== this.idContent)
    {
      this.idContent= idContent;
      this.obtenerContenido();
    }
  }

  usuarioLoggeado()
  {
    this.auth.user$.subscribe(user => this.usuario = user);
  }

  ngOnInit(): void {
  }

  innerHtml():void
  {
    document.getElementById('innerHtml')
    .innerHTML = this.contenido.foro;
  }

  obtenerContenido():void
  {
    this.lessonService.lessonContentDetail(this.idCurso,this.idLesson,this.idContent)
    .valueChanges()
    .subscribe(contenido => {
      this.contenido = contenido;
      this.innerHtml();
    });
    this.obtenerListaRespuesta();
  }

  obtenerListaRespuesta():void
  {
    this.lessonService.listReplyForo(this.idCurso,this.idLesson,this.idContent)
    .valueChanges()
    .subscribe(respuestas => this.respuestas=respuestas);
  }


  deleteReplyForo(idForo:string):void
  {
    this.lessonService.deleteReplyForo(this.idCurso, this.idLesson, this.idContent, idForo);
  }

  getAdsToDelete(idForo:string):void
  {
    Swal.fire({
      title: '¿Seguro quieres eliminar la respuesta del foro?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteReplyForo(idForo);
      }
    })
  }


  messageDeleteComentario(index:number, idReplyForo:string):void
  {
    Swal.fire({
      title: '¿Seguro quieres eliminar el comentario?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarComentario(index, idReplyForo);
      }
    })
  }

  eliminarComentario(index:number, idReplyForo:string)
  {
    this.lessonService.deleteComentario(index,this.idCurso,this.idLesson,this.idContent, idReplyForo)
  }

  goToReplyForo():void
  {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/reply-foro/${this.idCurso}/${this.idLesson}/${this.idContent}/responder`);
  }

  goToCitarForo():void
  {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/reply-foro/${this.idCurso}/${this.idLesson}/${this.idContent}/citar`);
  }

  goToReplyUsario(idForo):void
  {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/reply-foro/${this.idCurso}/${this.idLesson}/${this.idContent}/responder/${idForo}`);
  }

  goToEditarReply(idForo):void
  {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/reply-foro/${this.idCurso}/${this.idLesson}/${this.idContent}/editar/${idForo}`);
  }
}
