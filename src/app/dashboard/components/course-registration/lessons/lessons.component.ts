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
export class LessonsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'progreso', 'actions'];
  dataSource = new MatTableDataSource();

  courseId: String;
  stdId;

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

  listLesson(): void {
    this.lessonService.listLessons(this.courseId)
      .valueChanges()
      .forEach(lessons => {
        lessons.forEach(lesson => {
          this.getUserProgress(lesson)
        })
        this.dataSource.data = lessons;
      })
  }

  getUserProgress(lessonReceived) {
    let cont = 0;
    this.lessonService.listLessonContent(this.courseId, lessonReceived.id)
      .valueChanges()
      .forEach((lessonContents: any) => {
        lessonContents.forEach(content => {
          let progress = this.lessonService.ContentProgress(
            this.courseId,
            lessonReceived.id,
            content.id,
            this.stdId
          )
            .valueChanges()
            .subscribe(visto => {
              if (visto) {
                cont += 1;
                lessonReceived.porcentaje = Math.ceil(((lessonContents.length - (lessonContents.length - cont)) / lessonContents.length) * 100);
                // console.log(`content ${lessonContents.length} - cont ${cont} / content ${lessonContents.length}`)
              }
              progress.unsubscribe();
            })
        })
      })
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToCourseView(element: any): void {
    this.router.navigateByUrl(`dashboard/course-view/${this.courseId}/${element.id}/${this.stdId}`);
  }

}
