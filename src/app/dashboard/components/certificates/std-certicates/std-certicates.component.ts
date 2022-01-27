import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CerticateService } from '../../../../core/services/certificate/certicate.service';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-std-certicates',
  templateUrl: './std-certicates.component.html',
  styleUrls: ['./std-certicates.component.scss']
})
export class StdCerticatesComponent implements OnInit {

  stdId;
  coursesList;
  certificatesList: any = [];
  hasCertificates = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cursos: CourseService,
    private std: UsersService,
    private certificados: CerticateService,
  ) {
    this.stdId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    const courses = this.cursos.listCourses()
      .valueChanges()
      .subscribe(c => {
        this.coursesList = c;
        this.getUserData(c);
        courses.unsubscribe();
      });
  }

  getUserData(cursos): void {
    const userData = this.std.detailUser(this.stdId)
      .valueChanges()
      .subscribe(user => {
        this.getUserCourses(cursos, user);
        userData.unsubscribe();
      });
  }

  getUserCourses(cursos, user): void {
    console.log(cursos);
    console.log(user);
    cursos.forEach(c => {
      const userCourses = this.cursos.registeredUSerDetail(c.id, this.stdId)
        .valueChanges()
        .subscribe(registeredCourse => {
          if (registeredCourse) {
            const data = {
              courseId: c.id,
              stdId: this.stdId,
              courseImg: c.imagen,
              cc: user.identificacion ? user.identificacion : '1111'
            };
            this.isCertified(data);
          }
          userCourses.unsubscribe();
        });
    });
  }

  isCertified(data): void {
    const certificate = this.certificados.isCertified(data)
      .valueChanges()
      .subscribe((cert: any) => {
        if (cert.length > 0) {
          console.log('hola');
          cert[0].fechaFinalizacion = this.formatDate(cert[0].fechaFin);
          cert[0].fechaExpiracion = cert[0].fechaExp ? this.formatDate(cert[0].fechaExp) : '';
          cert[0].imagen = data.courseImg;
          this.certificatesList.push(cert[0]);
          this.hasCertificates = true;
        } else {
          this.hasCertificates = false;
        }
        certificate.unsubscribe();
      });
  }

  downloadPDF(data): void {
    this.certificados.downloadPDF(data);
  }

  formatDate(date): string {
    const fecha = new Date(date.seconds * 1000).toLocaleDateString();
    return fecha;
  }

}


