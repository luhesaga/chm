import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CerticateService } from '../../../../core/services/certificate/certicate.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import { CareerCertService } from '../../../../core/services/career-certificate/career-cert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-std-certicates',
  templateUrl: './std-certicates.component.html',
  styleUrls: ['./std-certicates.component.scss']
})
export class StdCerticatesComponent implements OnInit {

  stdId;
  coursesList;
  certificatesList: any = [];
  hasCertificates = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cursos: CourseService,
    private std: UsersService,
    private certificados: CerticateService,
    private careerCert: CareerCertService,
    private careerService: CarrerasService
  ) {
    this.stdId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getUserInfo();
    // this.getCourses();
  }

  getUserInfo(): void {
    const userInfo = this.std.detailUser(this.stdId)
      .valueChanges()
      .subscribe(user => {
        this.getCertificates(user);
        userInfo.unsubscribe();
      });
  }

  getCertificates(user): void {
    const stdCert = this.certificados.certificateByStdId(user.identificacion)
      .valueChanges()
      .subscribe(certs => {
        if (certs) { this.hasCertificates = true; }
        certs.forEach((cert: any) => {
          // console.log(cert);
          if (cert.careerCert) {
            this.getCareerDetail(cert, user);
          } else {
            this.getCourseDetail(cert, user);
          }
        });
        stdCert.unsubscribe();
      });
  }

  getCareerDetail(cert: any, user: any): void {
    const careerInfo = this.careerService.obtenerCarrera(cert.courseId)
      .valueChanges()
      .subscribe((c: any) => {
        cert.fechaFinalizacion = this.formatDate(cert.fechaFin);
        let dias;
        if (c.vence) {
          dias = 365 * c.vencimiento;
        } else {
          dias = 365 * 5;
        }
        cert.fechaExpiracion = cert.fechaExp ? this.fixDates(cert.fechaFin, dias) : '';
        cert.imagen = c.image;
        cert.profesor = 'Geovanny Alvarez G.';
        cert.cc = user.identificacion ? user.identificacion : '1111';
        cert.horas = `${c.duracionCarrera} HORAS`;
        cert.plantilla = c.plantilla;
        cert.vence = c.vence;
        cert.vencimiento = c.vencimiento;
        const allowCert = this.careerService
          .getRegisteredUser(
            c.id, this.stdId
          )
          .valueChanges()
          .subscribe(data => {
            if (data?.bloquearCert) {
              cert.bloquearCert = true;
            } else {
              cert.bloquearCert = false;
            }
            this.certificatesList.unshift(cert);
            allowCert.unsubscribe();
          });
        careerInfo.unsubscribe();
      });
  }

  getCourseDetail(cert: any, user: any): void {
    const courseInfo = this.cursos.detailCourse(cert.courseId)
      .valueChanges()
      .subscribe(c => {
        cert.fechaFinalizacion = this.formatDate(cert.fechaFin);
        let dias;
        if (c.vence) {
          dias = 365 * c.vencimiento;
        } else {
          dias = 365 * 5;
        }
        cert.fechaExpiracion = cert.fechaExp ? this.fixDates(cert.fechaFin, dias) : '';
        cert.imagen = c.imagen;
        cert.cc = user.identificacion ? user.identificacion : '1111';
        cert.vence = c.vence;
        cert.vencimiento = c.vencimiento;
        cert.plantilla = c.plantilla;
        const allowCert = this.cursos
          .registeredUSerDetail(
            c.id, this.stdId
          )
          .valueChanges()
          .subscribe(data => {
            if (data?.bloquearCert) {
              cert.bloquearCert = true;
            } else {
              cert.bloquearCert = false;
            }
            this.certificatesList.push(cert);
            allowCert.unsubscribe();
          });
        courseInfo.unsubscribe();
      });
  }

  // getCourses(): void {
  //   const courses = this.cursos.listCourses()
  //     .valueChanges()
  //     .subscribe(c => {
  //       this.coursesList = c;
  //       this.getUserData(c);
  //       courses.unsubscribe();
  //     });
  // }

  // getUserData(cursos): void {
  //   const userData = this.std.detailUser(this.stdId)
  //     .valueChanges()
  //     .subscribe(user => {
  //       this.getUserCourses(cursos, user);
  //       userData.unsubscribe();
  //     });
  // }

  // getUserCourses(cursos, user): void {
  //   console.log(cursos);
  //   console.log(user);
  //   cursos.forEach(c => {
  //     const userCourses = this.cursos.registeredUSerDetail(c.id, this.stdId)
  //       .valueChanges()
  //       .subscribe(registeredCourse => {
  //         if (registeredCourse) {
  //           const data = {
  //             courseId: c.id,
  //             stdId: this.stdId,
  //             courseImg: c.imagen,
  //             cc: user.identificacion ? user.identificacion : '1111'
  //           };
  //           this.isCertified(data);
  //         }
  //         userCourses.unsubscribe();
  //       });
  //   });
  // }

  // isCertified(data): void {
  //   const certificate = this.certificados.isCertified(data)
  //     .valueChanges()
  //     .subscribe((cert: any) => {
  //       if (cert.length > 0) {
  //         console.log('hola');
  //         cert[0].fechaFinalizacion = this.formatDate(cert[0].fechaFin);
  //         cert[0].fechaExpiracion = cert[0].fechaExp ? this.formatDate(cert[0].fechaExp) : '';
  //         cert[0].imagen = data.courseImg;
  //         this.certificatesList.push(cert[0]);
  //         this.hasCertificates = true;
  //       }
  //       certificate.unsubscribe();
  //     });
  // }

  downloadPDF(data): void {
    // console.log(data);
    if (!data.careerCert) {
      if (data.bloquearCert) {
        Swal.fire('Error', 'No tiene permitido descargar este certificado.', 'error');
      } else {
        if (data.plantilla === 'default') {
          this.mostrarMensajeCargando();
          this.certificados.downloadPDF(data);
        } else {
          this.mostrarMensajeCargando();
          this.certificados.getCertDesign(data);
        }
      }
    } else {
      if (data.bloquearCert) {
        Swal.fire('Error', 'No tiene permitido descargar este certificado.', 'error');
      } else {
        if (data.plantilla === 'default') {
          this.mostrarMensajeCargando();
          this.careerCert.downloadPDF(data);
        } else {
          this.mostrarMensajeCargando();
          this.careerCert.getCertDesign(data);
        }
      }
    }
  }

  formatDate(date): string {
    const fecha = new Date(date.seconds * 1000).toLocaleDateString();
    return fecha;
  }

  fixDates(fecha, dias): any {
    const fechaCons = new Date(fecha.seconds * 1000);
    const fechaExp = new Date(fechaCons.setDate(fechaCons.getDate() + dias));
    const ultimoDia = new Date(
      fechaExp.getFullYear(),
      fechaExp.getMonth() + 1,
      0
    );
    return ultimoDia.toLocaleDateString();
  }

  mostrarMensajeCargando(): void {
    Swal.fire({
      confirmButtonColor: '#005691',
      showConfirmButton: false,
      title: 'Generando el certificado...',
      timer: 4000,
      timerProgressBar: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
  }

}


