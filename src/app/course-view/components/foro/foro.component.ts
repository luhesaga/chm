import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

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

  constructor(
    private router: Router,
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.respuestas= [];
    this.contenido={};
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent= this.activatedRoute.snapshot.params.idContent;
    this.obtenerContenido();
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
}
