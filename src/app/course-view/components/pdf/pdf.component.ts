import { Component, OnInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit, DoCheck {

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

  obtenerContenido():void
  {
    this.lessonService.lessonContentDetail(this.idCurso,this.idLesson,this.idContent)
    .valueChanges()
    .subscribe(contenido => {
      this.contenido = contenido;
    })
  }

}
