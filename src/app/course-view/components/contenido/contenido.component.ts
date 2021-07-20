import { Component, OnInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit, DoCheck {

  idCurso:string;
  idLesson:string;
  idContent:string;
  stdId;

  contenido:any;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.contenido={}
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent= this.activatedRoute.snapshot.params.idContent;
    this.stdId= this.activatedRoute.snapshot.params.stdId;
    console.log(`curso: ${this.idCurso} leccion: ${this.idLesson}`)
    console.log(`contenido: ${this.idContent} user: ${this.stdId}`)
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
    this.obtenerContenido();
    this.markAsViewed();
  }

  markAsViewed() {
    let progress = this.lessonService.ContentProgress(
      this.idCurso,
      this.idLesson,
      this.idContent,
      this.stdId
    ).valueChanges()
      .subscribe(p => {
        console.log(p);
        if (!p) {
          this.lessonService.CreateContentProgress(
            this.idCurso,
            this.idLesson,
            this.idContent,
            this.stdId
          ).then(() => console.log('actualizado'))
            .catch(error => console.log(error))
        }
        progress.unsubscribe();
      });
  }

  innerHtml():void
  {
    document.getElementById('innerHtml')
    .innerHTML = this.contenido.contenido;
  }

  obtenerContenido():void
  {
    this.lessonService.lessonContentDetail(this.idCurso,this.idLesson,this.idContent)
    .valueChanges()
    .subscribe(contenido => {
      this.contenido = contenido;
      // console.log(this.contenido)
      this.innerHtml();
    })
  }

}
