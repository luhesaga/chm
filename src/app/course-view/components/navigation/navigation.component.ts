import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class NavigationComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  idCurso: string;
  idLesson: string;
  stdId;

  course;
  courseReceived;
  lessonsContent: any = [];
  lesson;
  lessonReceived;
  content: any = {};

  class: string;

  constructor(
    private lessonService: LessonsService,
    private courseService: CourseService,
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.idCurso = this.activatedRoute.snapshot.params.CId;
    this.idLesson = this.activatedRoute.snapshot.params.LId;
    this.stdId = this.activatedRoute.snapshot.params.SId;
    //console.log(`curso: ${this.idCurso} leccion: ${this.idLesson} user: ${this.stdId}`);
    this.class = 'prueba';
  }

  ngOnInit(): void {
    this.getCourse();
  }

  ngOnDestroy(): void {
    this.courseReceived.unsubscribe();
    this.lessonReceived.unsubscribe();
  }

  getCourse(): void {
    this.courseReceived = this.courseService.detailCourse(this.idCurso)
      .valueChanges()
      .subscribe(curso => {
        this.course = curso;
        this.getLesson(curso.id);
      });
  }

  getLesson(cid): void {
    this.lessonReceived = this.lessonService.lessonDetail(cid, this.idLesson)
      .valueChanges()
      .subscribe((lesson: any) => {
        this.lesson = lesson;
        this.getLessonContent(lesson);
      });
  }

  getLessonContent(lesson): void {
    this.lessonService.listLessonContent(this.idCurso, lesson.id)
      .valueChanges()
      .subscribe((l) => {
        this.lessonsContent = l;
        this.pogresoContenido(lesson);
        /*for (const i of l) {
          //console.log(i)
          this.lessonService.ContentProgress(
            this.idCurso,
            lesson.id,
            i.id,
            this.stdId
          ).valueChanges()
          .forEach(element => {
            console.log(element)
            if (element) {
              i.visto = true;
            } else {
              i.visto = false;
            }
            this.lessonsContent.push(i)
          });
        }*/
    })
  }

  pogresoContenido(lesson)
  {
    this.lessonsContent.forEach(i =>{
      this.lessonService.ContentProgress(
        this.idCurso,
        lesson.id,
        i.id,
        this.stdId
      ).valueChanges()
      .subscribe((element:any) => {
        if(element)
        {
          if(element.visto)
          {
            i.visto= true;
          }
          else
          {
            i.visto= false;
          }
        }
        else
        {
          i.visto= false;
        }
      })
    })
  }

  showContent(content: any): void {
    this.content = content;
    if (this.content.tipo === 'Agregar contenido') {
      this.goToContenido(this.content.id);
    } else if (this.content.tipo === 'Agregar foro') {
      this.goToForo(this.content.id);
    } else if (this.content.tipo === 'Agregar archivo PDF'){
      this.goToPdf(this.content.id)
    } else {
      this.goToContenido(this.content.id);
    }
  }

  iHtml(): void {
    try {
      this.chooseTypeOfActivity();
    } catch (e) {
      console.log(e);
    }
  }

  chooseTypeOfActivity(): void {
    if (this.content.contenido) {
      this.class = ""
      document.getElementById('innerHtml')
        .innerHTML = this.content.contenido;
    }
    else {
      document.getElementById('innerHtml')
        .innerHTML = this.content.foro;
      this.class = 'foro';
    }
  }

  hiddenHtml(): void {
    this.class = "";
    document.getElementById('innerHtml')
      .innerHTML = '';
  }

  goToLecciones() {
    this.router.navigateByUrl('dashboard/mis-cursos/lecciones/' + this.idCurso + '/' + this.stdId);
  }

  goToReplyForo() {
    this.router.navigateByUrl(`course-view/${this.idCurso}/${this.idLesson}/reply-foro`);
  }

  goToForo(cntid: string) {
    const cid = this.idCurso;
    const lid = this.idLesson;
    const sid = this.stdId;
    this.router.navigateByUrl(`/course-view/${cid}/${lid}/${sid}/foro/${cid}/${lid}/${cntid}/${sid}`);
  }

  goToPdf(cntid: string) {
    const cid = this.idCurso;
    const lid = this.idLesson;
    const sid = this.stdId;
    this.router.navigateByUrl(`course-view/${cid}/${lid}/${sid}/pdf/${cid}/${lid}/${cntid}/${sid}`);
  }

  goToContenido(cntid: string) {
    const cid = this.idCurso;
    const lid = this.idLesson;
    const sid = this.stdId;
    this.router.navigate([`course-view/${cid}/${lid}/${sid}/contenido/${cid}/${lid}/${cntid}/${sid}`]);
  }

}
