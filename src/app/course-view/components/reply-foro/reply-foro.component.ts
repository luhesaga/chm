import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-reply-foro',
  templateUrl: './reply-foro.component.html',
  styleUrls: ['./reply-foro.component.scss']
})
export class ReplyForoComponent implements OnInit {

  idCurso:string;
  idLesson:string;
  idContent:string;
  idReplyForo:string;

  tipo:string;
  answer: string;

  contenido:any;

  constructor(
    private router: Router,
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService
  ) {
    this.contenido={};
    this.tipo= this.activatedRoute.snapshot.params.tipo;
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent= this.activatedRoute.snapshot.params.idContent;
    this.idReplyForo = this.activatedRoute.snapshot.params.idReplayForo;
   }

  ngOnInit(): void {
    if(!(this.tipo === 'responder'
    || this.tipo === 'citar'
    || this.tipo === 'editar'))
    {
      this.goToLogin()
    }
    if(this.idReplyForo)
    {
      this.obtenerRespuestaForo();
    }
    else
    {
      this.obtenerContenido();
    }
  }

  obtenerContenido():void
  {
    this.lessonService.lessonContentDetail(this.idCurso,this.idLesson,this.idContent)
    .valueChanges()
    .subscribe(contenido => {
      this.contenido = contenido
      if(!this.contenido)
      {
        this.goToLogin();
      }
    })
  }

  obtenerRespuestaForo()
  {
    this.lessonService.getReplyForo(this.idCurso,this.idLesson,this.idContent,this.idReplyForo)
    .valueChanges()
    .subscribe(foro => {
      this.contenido=foro;
      this.showReplyForo(foro);
      if(!this.contenido)
      {
        this.goToLogin();
      }
    });
  }

  showReplyForo(foro:any)
  {
    if(this.tipo==='editar')
    {
      this.answer = foro.contenido;
    }
  }

  enviarForo():void
  {
    let usuario:any;
    const subUsuario = this.auth.user$.subscribe(u => 
      {
        usuario=u;
        const data= {
          tiempo: new Date(),
          tipo:this.tipo,
          contenido: this.answer,
          nombreCompleto: usuario.nombres+' '+usuario.apellidos,
          id:usuario.id,
        }
        this.lessonService.pushForo(data,this.idCurso,this.idLesson,this.idContent);
        subUsuario.unsubscribe();
        this.goToForo();
      })
  }

  enviarComentario()
  {
    let usuario:any;
    const subUsuario = this.auth.user$.subscribe(u => 
      {
        usuario=u;
        const data= {
          tiempo: new Date(),
          tipo:this.tipo,
          contenido: this.answer,
          nombreCompleto: usuario.nombres+' '+usuario.apellidos,
          idUsuario:usuario.id,
        }
        this.lessonService.pushComentario(data,this.idCurso,this.idLesson,this.idContent, this.idReplyForo);
        subUsuario.unsubscribe();
        this.goToForo();
      })
  }

  editarForo()
  {
    console.log(this.answer);
    this.lessonService.editarForo(this.answer,this.idCurso,this.idLesson,this.idContent, this.idReplyForo)
    .catch(()=> console.log('error al editar foro'))
    .then(()=> this.goToForo());
  }

  goToForo()
  {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/foro/${this.idCurso}/${this.idLesson}/${this.idContent}`)
  }

  goToLogin()
  {
    this.router.navigateByUrl('login')
  }
}
