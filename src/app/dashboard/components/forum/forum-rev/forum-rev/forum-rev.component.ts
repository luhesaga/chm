import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from '../../../../../core/services/lessons/lessons.service';

@Component({
  selector: 'app-forum-rev',
  templateUrl: './forum-rev.component.html',
  styleUrls: ['./forum-rev.component.scss']
})
export class ForumRevComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['leccion', 'foro', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId;
  stdId;
  exerciseId;
  data;
  exercise;
  CourseUsers: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private lessonService: LessonsService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
  }

  ngOnInit(): void {
    this.getCourseForums();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourseForums() {
    let lessons = this.lessonService.listLessons(this.courseId)
      .valueChanges()
      .subscribe((l: any) => {
        this.data = [];
        l.forEach(c => {
          this.getForums(c);
        });
        lessons.unsubscribe();
      })
  }

  getForums(c) {
    let foros = this.lessonService.listForums(this.courseId, c.id)
      .valueChanges()
      .subscribe((f: any) => {
        if (f.length > 0) {
          f.forEach(forum => {
            let foro: any = {
              idLeccion: c.id,
              leccion: c.nombre,
              foro: forum,
            }
            this.data.push(foro);
            this.dataSource.data = this.data;
            //console.log(this.dataSource.data);
          });
        }
        foros.unsubscribe();
      });
  }

  goToForumAnswers(forum) {
    const cid = this.courseId;
    const lid =  forum.idLeccion;
    const fid = forum.foro.id;

    this.router.navigate([`cursos/foros/revisar/respuestas/${cid}/${lid}/${fid}`]);
  }

  goBack() {
    this.router.navigate([`cursos/index/${this.courseId}`]);
  }

}
