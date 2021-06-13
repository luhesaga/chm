import { Component, OnInit, Input, DoCheck } from '@angular/core';
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

  contenido:any;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.contenido={}
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

  obtenerContenido():void
  {
    this.lessonService.lessonContentDetail(this.idCurso,this.idLesson,this.idContent)
    .valueChanges()
    .subscribe(contenido => {
      this.contenido = contenido;
    })
  }

}
