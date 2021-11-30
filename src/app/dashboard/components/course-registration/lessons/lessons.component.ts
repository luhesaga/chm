import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CerticateService } from '../../../../core/services/certificate/certicate.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'progreso', 'actions'];
  dataSource = new MatTableDataSource();

  courseId: string;
  stdId;
  LogguedUser;
  course;

  lessonsReceived;
  contents;
  finished = false;

  userLessons;

  certificado: boolean;
  fechaFin;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private courseService: CourseService,
    private certificate: CerticateService,
    private router: Router,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.certificado = false;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.listLesson();
    this.getUserData();
    this.getCourseData();
  }

  ngOnDestroy(): void {
    this.lessonsReceived.unsubscribe();
  }

  generarCertificado(lessons): boolean {
    const lesson: any = lessons[lessons.length - 1] || { porcentaje: 0 };
    if (lesson.porcentaje === 100) {
      //console.log(lesson);
      let isFinished = this.courseService.registeredUSerDetail(this.courseId, this.stdId)
        .valueChanges()
        .subscribe((f: any) => {
          if (f.finalizado) {
            this.fechaFin = f.fechaFin;
          } else {
            this.courseService.courseFinish(this.courseId, this.stdId)
              .then(() => {
                this.fechaFin = new Date();
              })
              .catch(err => console.log(err));
          }
          isFinished.unsubscribe();
        });
      return true;
    } else {
      //console.log(lesson);
      return false;
    }
  }

  listLesson() {
    this.lessonsReceived = this.lessonService.listLessons(this.courseId)
      .valueChanges()
      .subscribe(lessons => {
        this.getLessonsContent(lessons)
        this.dataSource.data = lessons;
      })

  }

  getLessonsContent(lessons) {
    lessons.forEach(lesson => {
      let contentReceived = this.lessonService.listLessonContent(this.courseId, lesson.id)
        .valueChanges()
        .subscribe(lessonContents => {
          this.getUserProgress(lessonContents, lesson, lessons);
          contentReceived.unsubscribe();
        });
    });
  }

  getUserProgress(lessonContents, lesson, lessons) {
    lesson.porcentaje = 0;
    const arr = []

    lessonContents.forEach(content => {
      let userProgress = this.lessonService.ContentProgress(this.courseId, lesson.id, content.id, this.stdId)
        .valueChanges()
        .subscribe(visto => {
          let cont = 0;
          if (visto) {
            arr.forEach(item => {
              if (content.id === item.id) {
                cont += 1;
              }
            })
            if (cont === 0) {
              arr.push(content);
            }
            //console.log(arr);
          }
          lesson.porcentaje = Math.ceil(((lessonContents.length - (lessonContents.length - arr.length)) / lessonContents.length) * 100);
          this.finished = this.generarCertificado(lessons);
          userProgress.unsubscribe();
        });
    });
  }

  getUserData() {
    let user = this.userService.detailUser(this.stdId)
      .valueChanges()
      .subscribe(u => {
        this.LogguedUser = u;
        //console.log(this.LogguedUser);
        user.unsubscribe();
      })
  }

  getCourseData() {
    let course = this.courseService.detailCourse(this.courseId)
      .valueChanges()
      .subscribe(c => {
        this.course = c;
        course.unsubscribe();
      })
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  lessonActivated(element: any): boolean {
    let index = this.dataSource.data.findIndex((lesson: any) => lesson.id === element.id);
    if (index === 0) {
      return true;
    }
    else {
      let lesson: any = this.dataSource.data[index - 1];
      if (lesson.porcentaje === 100) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  goToCourseView(element: any) {
    this.router.navigate([`dashboard/course-view/${this.courseId}/${element.id}/${this.stdId}`]);
  }

  goBack() {
    this.router.navigate([`cursos/index/${this.courseId}/${this.stdId}`]);
  }

}
