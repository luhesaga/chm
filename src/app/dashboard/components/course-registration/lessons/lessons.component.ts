import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { UsersService } from '../../../../core/services/users/users.service';
import { CourseService } from '../../../../core/services/courses/course.service';

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

  // lessonsReceived;
  // contentReceived;
  contents;
  // userProgress;

  userLessons;

  certificado: boolean;
  fechaFin;

  constructor(
    private lessonService: LessonsService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private courseService: CourseService,
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
    //this.lessonsReceived.unsubscribe();
    //this.contentReceived.unsubscribe();
    //this.userProgress.unsubscribe();
  }

  listLesson(): void {
    let lessonsReceived = this.lessonService.listLessons(this.courseId)
      .valueChanges()
      .subscribe(lessons => {
        this.getLessonsContent(lessons)
        this.dataSource.data = lessons;
        lessonsReceived.unsubscribe();
      })

  }

  getLessonsContent(lessons) {
    lessons.forEach(lesson => {
      let contentReceived = this.lessonService.listLessonContent(this.courseId, lesson.id)
        .valueChanges()
        .subscribe(lessonContents => {
          this.getUserProgress(lessonContents, lesson);
          contentReceived.unsubscribe();
        })
    });
  }

  getUserProgress(lessonContents, lesson) {
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
          userProgress.unsubscribe();
        });
    });
  }

  getUserData() {
    let user = this.userService.detailUser(this.stdId)
      .valueChanges()
      .subscribe(u => {
        this.LogguedUser = u;
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

  goToCourseView(element: any) {
    console.log(element);
    this.router.navigate([`dashboard/course-view/${this.courseId}/${element.id}/${this.stdId}`]);
  }

  goBack() {
    this.router.navigate([`cursos/index/${this.courseId}/${this.stdId}`]);
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

  generarCertificado() {
    const lastIndex = this.dataSource.data.length - 1;
    const lesson: any = this.dataSource.data[lastIndex] || { porcentaje: 0 };
    if (lesson.porcentaje === 100) {
      let finish = this.courseService.registeredUSerDetail(this.courseId, this.stdId)
        .valueChanges()
        .subscribe((f: any) => {
          if (f.finalizado) {
            this.fechaFin = f.fechaFin;
            return true;
          } else {
            this.courseService.courseFinish(this.courseId, this.stdId)
              .then(() => {
                this.fechaFin = new Date();
                return true
              })
              .catch(err => console.log(err));
          }
          finish.unsubscribe();
        })
      return true;
    }
    else {
      return false;
    }
  }

  downloadPDFCerticate() {
    // fecha finalizacion del curso
    let f = new Date(this.fechaFin.seconds * 1000);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = (f.getDate() + ' de ' + meses[f.getMonth()] + ' de ' + f.getFullYear());
    // horas del curso
    let hours = this.getCourseDuration();

    let student = `${this.LogguedUser.nombres} ${this.LogguedUser.apellidos}`;
    // let student = `Luis Hernando Sarmiento Garzón`;
    let teacher = `${this.course.profesor}`;
    let text1 = 'Hace constar que';
    let text2 = `Cursó y aprobó satisfactoriamente la acción de formación`;
    let course = `${this.course.nombre}`;
    let text4 = `ASNT NDT LEVEL II`;
    let text5 = `Director General`;

    let doc = new jsPDF(
      {
        orientation: 'l',
        format: 'letter',
        unit: 'px'
      }
    );

    // Funcion para centrar los textos
    const centerText = (text: string) => {
      let fontSize = doc.getFontSize();
      let pageWidth = doc.internal.pageSize.width;
      let txtWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      return Math.ceil((pageWidth - txtWidth) / 2);
    };

    doc.setFillColor(236, 239, 241);
    doc.rect(0, 0, 756, 612, "F");
    doc.addImage('../../../assets/img/certificate-banner.png', 'PNG', 20, 3, 580, 80);
    doc.addImage('../../../assets/img/certificate-lines.png', 'PNG', 3, 3, 70, 450);
    doc.setFontSize(16);
    doc.setTextColor(0, 114, 121);
    doc.text(text1, centerText(text1), 110);
    doc.setFontSize(28);
    doc.setTextColor(55, 71, 79);
    doc.text(student.toUpperCase(), centerText(student), 160);
    doc.setFontSize(16);
    doc.setTextColor(0, 114, 121);
    doc.text(text2, centerText(text2), 200,);
    doc.setFontSize(28);
    doc.setTextColor(55, 71, 79);
    doc.text(course, centerText(course), 235);
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 121);
    doc.text(`Realizado:`, 100, 295);
    doc.setTextColor(55, 71, 79);
    doc.text(fecha, 160, 295);
    doc.setTextColor(0, 114, 121);
    doc.text(`Duracion:`, 380, 295);
    doc.setTextColor(55, 71, 79);
    doc.text(`${hours} HORAS`, 440, 295);
    doc.setTextColor(0, 114, 121);
    doc.text(`Lugar:`, 380, 315);
    doc.setTextColor(55, 71, 79);
    doc.text(`Barranquilla - Colombia`, 430, 315);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text(teacher, centerText(teacher), 370);
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 121);
    doc.setFont('times', 'normal');
    doc.text(text4, centerText(text4), 385);
    doc.text(text5, centerText(text5), 400);
    doc.addImage('../../../assets/img/logo-ASNT.png', 'PNG', 450, 340, 100, 90);
    doc.save(`certificado.pdf`);

  }

  getCourseDuration() {
    let hours = this.course.duracion.toUpperCase();
    let h;
    let pos = hours.indexOf('HORAS');
    if (hours.substring(pos - 4)[0] === '>') {
      h = hours.substring(pos - 3, pos - 1);
    } else {
      h = hours.substring(pos - 4, pos - 1);
    }
    return h;
  }

}
