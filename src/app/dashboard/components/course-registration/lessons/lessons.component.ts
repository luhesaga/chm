import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  courseId: String;
  stdId;

  lessonsReceived;
  contentReceived;
  contents;
  userProgress;

  userLessons;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.listLesson();
  }

  ngOnDestroy(): void {
    this.lessonsReceived.unsubscribe();
    this.contentReceived.unsubscribe();
    this.userProgress.unsubscribe();
  }

  listLesson(): void {
    this.lessonsReceived = this.lessonService.listLessons(this.courseId)
      .valueChanges()
      .subscribe(lessons => {
        this.getLessonsContent(lessons)
        this.dataSource.data = lessons;
      })

  }

  getLessonsContent(lessons) {
    lessons.forEach(lesson => {
      this.contentReceived = this.lessonService.listLessonContent(this.courseId, lesson.id)
      .valueChanges()
      .subscribe(lessonContents => {
        this.getUserProgress(lessonContents, lesson);
      })
    });
  }

  getUserProgress(lessonContents, lesson) {
    lesson.porcentaje = 0;
    const arr = []

    lessonContents.forEach(content => {
      this.userProgress = this.lessonService.ContentProgress(this.courseId, lesson.id, content.id, this.stdId)
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
      });
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToCourseView(element: any): void {
    this.router.navigateByUrl(`dashboard/course-view/${this.courseId}/${element.id}/${this.stdId}`);
  }

}
