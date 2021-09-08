import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
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
export class DocumentsComponent implements OnInit, AfterViewInit, OnDestroy {

  admin = true;
  cursoId: string;
  lessonsId: any[];
  contentPDF: any[];
  contentVideo: any[];
  contentList: any[];
  stdId: any;

  //observables
  listLessons: any;
  PDFLessons: any;
  listDocuments: any;
  ytVideos: any;

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
    this.contentPDF = [];
    this.contentVideo = [];
    this.contentList = [];
  }

  ngOnInit(): void {
    this.obtenerIdLessons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.listLessons.unsubscribe();
    this.PDFLessons.unsubscribe();
    this.listDocuments.unsubscribe();
    this.ytVideos.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerIdLessons() {
    this.listLessons = this.lessonService.listLessons(this.cursoId)
      .valueChanges()
      .subscribe(lessons => {
        this.lessonsId = [];
        lessons.forEach(lesson => this.lessonsId.push(lesson.id));
        this.getContent();
      });
  }

  getContent(): void {
    this.lessonsId.forEach(lessonId => {
      this.PDFLessons = this.lessonService.listLessonContentPDF(this.cursoId, lessonId)
        .valueChanges()
        .subscribe((contentPDF: any[]) => {
          contentPDF.forEach(content => {
            if (!this.getPDFContent(content.id)) {
              this.contentPDF.push(content);
            }
          });
          this.getYTVideos(lessonId);
        });
    });
  }

  getDocuments() {
    this.listDocuments = this.courseService.getDocuments(this.cursoId)
      .valueChanges()
      .subscribe(documentos => {
        this.contentList = this.contentPDF.concat(this.contentVideo).concat(documentos);
        this.dataSource.data = this.contentList;
      });
  }

  getYTVideos(idLesson: string) {
    this.ytVideos = this.lessonService.listLessonAgregarContenido(this.cursoId, idLesson)
      .valueChanges()
      .subscribe((videos: any[]) => {
        videos.forEach(video => {
          if (!this.getVideoContent(video.id)) {
            video.contenido = this.filtrarUrlVideo(video.contenido);
            if (video.contenido) {
              this.contentVideo.push(video);
            }
          }
        })
        this.getDocuments();
      });
  }

  filtrarUrlVideo(cadenaConUrl: string) {
    const inicioLink = cadenaConUrl.indexOf('src="') + 5;
    const link = cadenaConUrl.substring(inicioLink, cadenaConUrl.length - 1);
    const finLink = link.indexOf('"');
    const newLink = link.substring(0, finLink);
    let isImg = false;
    if (newLink.indexOf('jpg') !== -1 || newLink.indexOf('png') !== -1 || inicioLink === -1) {
      isImg = true;
    }
    return isImg ? null : newLink;
    //return cadenaConUrl.match(/https:\/\/[\W\w]*\?/i);
  }

  getPDFContent(idContent: string): boolean {
    let encontrado = this.contentPDF.findIndex(content => content.id === idContent);
    if (encontrado !== -1) {
      return true;
    }
    return false;
  }

  getVideoContent(idVideo: string): boolean {
    let encontrado = this.contentVideo.findIndex(video => video.id === idVideo);
    if (encontrado !== -1) {
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
      height: '80%',
      data: { cursoId: this.cursoId }
    });
  }

}

