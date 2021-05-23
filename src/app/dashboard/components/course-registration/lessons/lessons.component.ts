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

  idCurso: String;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  )
  {
    this.idCurso = this.activatedRoute.snapshot.params.id;
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
    this.lessonService.listLessons(this.idCurso)
    .valueChanges()
    .subscribe(lessons => this.dataSource.data = lessons)
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToCourseView(element:any):void
  {
    this.router.navigateByUrl(`dashboard/course-view/${this.idCurso}/${element.id}`);
  }

}
