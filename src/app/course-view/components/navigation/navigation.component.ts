import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private lessonService: LessonsService,
    private courseService: CourseService,
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,)
    {
      this.idCurso = this.activatedRoute.snapshot.params.idCurso;
      this.idLesson = this.activatedRoute.snapshot.params.idLesson;
      this.curso={};
      this.lesson = {};
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

}
