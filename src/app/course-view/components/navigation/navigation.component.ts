import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    idCurso:string;
    idLesson:string;

    curso:any;
    lessonsContent: any[];
    lesson:any;
    content:any;

    class:string;

  constructor(
    private lessonService: LessonsService,
    private courseService: CourseService,
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router)
    {
      this.idCurso = this.activatedRoute.snapshot.params.idCurso;
      this.idLesson = this.activatedRoute.snapshot.params.idLesson;
      this.curso={};
      this.lesson = {};
      this.content = {};
      this.class = 'prueba';
      this.obtenerCurso();
      this.obtenerContenidoLeccione();
      this.obtenerLeccion();
    }

    obtenerCurso():void
    {
      this.courseService.detailCourse(this.idCurso)
      .valueChanges()
      .subscribe(curso => this.curso=curso);
    }

    obtenerLeccion():void
    {
      this.lessonService.lessonDetail(this.idCurso, this.idLesson)
      .valueChanges()
      .subscribe(lesson => this.lesson = lesson);
    }

    obtenerContenidoLeccione():void
    {
      this.lessonService.listLessonContent(this.idCurso, this.idLesson)
      .valueChanges()
      .subscribe(lessons => this.lessonsContent=lessons);
    }

    showContent(content:any):void
    {
      this.content=content;
      if(this.content.tipo === 'Agregar contenido')
      {
        this.goToContenido(this.content.id);
      } else if (this.content.tipo === 'Agregar foro')
      {
        this.goToForo(this.content.id);
      }
      else
      {
        this.goToPdf(this.content.id)
      }
    }

    iHtml():void
    {
      try
      {
        this.chooseTypeOfActivity();
      } catch(e)
      {
        console.log(e);
      }
    }

    chooseTypeOfActivity():void
    {
      if(this.content.contenido)
      {
        this.class= ""
        document.getElementById('innerHtml')
        .innerHTML = this.content.contenido;
      }
      else
      {
        document.getElementById('innerHtml')
        .innerHTML = this.content.foro;
        this.class='foro';
      }
    }

    hiddenHtml():void
    {
      this.class ="";
      document.getElementById('innerHtml')
      .innerHTML = '';
    }

    goToLecciones()
    {
      this.router.navigateByUrl('course-registration/lessons/'+this.idCurso);
    }

    goToReplyForo()
    {
      this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/reply-foro`);
    }

    goToForo(idContent:string)
    {
      this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/foro/${this.idCurso}/${this.idLesson}/${idContent}`);
    }

    goToPdf(idContent:string)
    {
      this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/pdf/${this.idCurso}/${this.idLesson}/${idContent}`);
    }

    goToContenido(idContent:string)
    {
      this.router.navigate([`course-view/${this.idCurso}/${this.idLesson}/contenido/${this.idCurso}/${this.idLesson}/${idContent}`]);
    }

}
