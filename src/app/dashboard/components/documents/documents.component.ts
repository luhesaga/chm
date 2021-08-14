import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { ModalDocumentsComponent } from './modal-documents/modal-documents.component';
import { CourseService } from 'src/app/core/services/courses/course.service';

export interface DialogData {
  cursoId: string;
}


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
  cotentVideo:any[];
  cotentList:any[];
  stdId:any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'enlace'];
  dataSource = new MatTableDataSource();

  constructor(
    private activatedRoute: ActivatedRoute,
    private lessonService: LessonsService,
    private courseService: CourseService,
    private route: Router,
    public dialog: MatDialog
  ) {
    this.cursoId = this.activatedRoute.snapshot.params.idCurso;
    this.stdId = this.activatedRoute.snapshot.params.idEstudiante;

    if (this.stdId) {
      this.admin = false;
    }
    this.obtenerIdLessons();
    this.cotentPDF = [];
    this.cotentVideo =[];
    this.cotentList =[];
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
        this.obtenerVideosYoutube(idLesson);
      });
    });
  }

  obtenerVideosYoutube(idLesson:string)
  {
    this.lessonService.listLessonAgregarContenido(this.cursoId,idLesson)
    .valueChanges()
    .subscribe((videos:any[])=>{
      videos.forEach(video => {
        if(!this.encontrarContentVideo(video.id))
        {
          video.contenido = this.filtrarUrlVideo(video.contenido);
          this.cotentVideo.push(video);
        }
      })
      this.obtenerDocumentos();
    });
  }

  obtenerDocumentos()
  {
    this.courseService.getDocuments(this.cursoId)
    .valueChanges()
    .subscribe(documentos => {
      this.cotentList = this.cotentPDF.concat(this.cotentVideo).concat(documentos);
      this.dataSource.data = this.cotentList;
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filtrarUrlVideo(cadenaConUrl:string)
  {
    return cadenaConUrl.match(/https:\/\/[\W\w]*\?/i);
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

  encontrarContentVideo(idVideo:string):boolean
  {
    let encontrado = this.cotentVideo.findIndex(video => video.id === idVideo);
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

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalDocumentsComponent, {
      width: '40rem',
      height:'80%',
      data:{cursoId: this.cursoId}
    });
  }

}

