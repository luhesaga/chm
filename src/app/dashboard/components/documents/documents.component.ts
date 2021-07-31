import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit {

  admin = true;
  cursoId:string;
  lessonsId: any[];
  cotentPDF:any[];
  stdId:any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'enlace'];
  dataSource = new MatTableDataSource();

  constructor(
    private activatedRoute: ActivatedRoute,
    private lessonService: LessonsService,
    private route: Router
  ) {
    this.cursoId = this.activatedRoute.snapshot.params.idCurso;
    this.stdId = this.activatedRoute.snapshot.params.idEstudiante;

    if (this.stdId) {
      this.admin = false;
    }
    this.obtenerIdLessons();
    this.cotentPDF = [];
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerIdLessons()
  {
    this.lessonService.listLessons(this.cursoId)
    .valueChanges()
    .subscribe(lessons => {
      this.lessonsId=[];
      lessons.forEach(lesson => this.lessonsId.push(lesson.id));
      this.obtenerContenido();
    });
  }

  obtenerContenido():void
  {

    this.lessonsId.forEach(idLesson => {
      this.lessonService.listLessonContentPDF(this.cursoId,idLesson)
      .valueChanges()
      .subscribe((contentPDF:any[]) => {
        contentPDF.forEach(content => {
        if(!this.encontrarContentPDF(content.id))
        {
          this.cotentPDF.push(content);
        }
        });
        this.dataSource.data = this.cotentPDF;
      });
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  encontrarContentPDF(idContent:string):boolean
  {
    let encontrado = this.cotentPDF.findIndex(content => content.id === idContent);
    if(encontrado !== -1)
    {
      return true;
    }
    return false;
  }

  goBack() {

    if (this.admin) {
      this.route.navigate([`cursos/index/${this.cursoId}`]);
    } else {
      this.route.navigate([`cursos/index/${this.cursoId}/${this.stdId}`]);
    }
  }

}
