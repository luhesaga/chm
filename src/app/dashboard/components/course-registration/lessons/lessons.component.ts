import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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

  displayedColumns: string[] = ['nombre','progreso' ,'actions'];
  dataSource = new MatTableDataSource();

  courseId: String;
  stdId;

  lessonsReceived;
  userLessons;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  )
  {
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

  listLesson():void
  {
    this.lessonService.listLessons(this.courseId)
    .valueChanges()
    .subscribe(lessons => {
      console.log(lessons);
      this.dataSource.data = lessons;
    })
  }

  getUserProgress() {

  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToCourseView(element:any):void
  {
    this.router.navigateByUrl(`dashboard/course-view/${this.courseId}/${element.id}/${this.stdId}`);
  }

}
