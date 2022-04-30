import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CerticateService } from 'src/app/core/services/certificate/certicate.service';
import Swal from 'sweetalert2';
import { CourseService } from '../../../../core/services/courses/course.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import { Console } from 'console';

@Component({
  selector: 'app-cert-validation',
  templateUrl: './cert-validation.component.html',
  styleUrls: ['./cert-validation.component.scss'],
})
export class CertValidationComponent implements OnInit {
  @ViewChild('myinput') myInputField: ElementRef;
  validationForm: FormGroup;
  certReceived: any = [];
  show = false;
  tipos: any;

  constructor(
    private formBuilder: FormBuilder,
    private certificados: CerticateService,
    private courseService: CourseService,
    private careerService: CarrerasService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.tipos = this.certificados.tipoCert;
  }

  private buildForm(): void {
    this.validationForm = this.formBuilder.group({
      certificado: ['', Validators.required],
    });
  }

  get certificadoField(): any {
    return this.validationForm.get('certificado');
  }

  validateCert(event: Event): void {
    event.preventDefault();
    this.certReceived.length = 0;
    this.validationForm.markAllAsTouched();
    const data = this.validationForm.value.certificado;
    const certificate = this.certificados
      .certificateByCertId(data)
      .valueChanges()
      .subscribe((cert: any) => {
        if (cert.length > 0) {
          cert.forEach((c) => {
            let val = 0;
            const courseInfo = this.courseService.detailCourse(c.courseId)
              .valueChanges()
              .subscribe(curso => {
                if (curso) {
                  val = 1;
                  c.fechaFin = this.formatDate(c.fechaFin);
                  c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
                  c.vence = curso.vence;
                  c.vencimiento = curso.vencimiento;
                  c.tipo = !c.careerCert
                    ? this.tipos.filter((x) => x.sigla === c.tipo)[0].nombre
                    : 'Carrera';
                } else {
                  const careerInfo = this.careerService.obtenerCarrera(c.courseId)
                    .valueChanges()
                    .subscribe(carrera => {
                      if (carrera) {
                        val = 1;
                        c.fechaFin = this.formatDate(c.fechaFin);
                        c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
                        c.vence = carrera.vence;
                        c.vencimiento = carrera.vencimiento;
                        c.tipo = !c.careerCert
                          ? this.tipos.filter((x) => x.sigla === c.tipo)[0].nombre
                          : 'Carrera';
                      }
                      careerInfo.unsubscribe();
                    });
                }
                if (val === 0) {
                  c.fechaFin = this.formatDate(c.fechaFin);
                  c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
                  c.vence = true;
                  c.tipo = !c.careerCert
                    ? this.tipos.filter((x) => x.sigla === c.tipo)[0].nombre
                    : 'Carrera';
                }
                courseInfo.unsubscribe();
              });
          });
          this.certReceived = cert;
          this.show = true;
          this.myInputField.nativeElement.focus();
          this.myInputField.nativeElement.select();
        } else {
          this.getCertBystdId(data);
        }
        certificate.unsubscribe();
      });
  }

  getCertBystdId(cc): void {
    const userCert = this.certificados
      .certificateByStdId(cc)
      .valueChanges()
      .subscribe((cert: any) => {
        if (cert.length > 0) {
          cert.forEach((c) => {
            console.log(c);
            let val = 0;
            const courseInfo = this.courseService.detailCourse(c.courseId)
              .valueChanges()
              .subscribe(curso => {
                if (curso) {
                  val = 1;
                  c.fechaFin = this.formatDate(c.fechaFin);
                  c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
                  c.vence = curso.vence;
                  c.vencimiento = curso.vencimiento;
                  c.tipo = !c.careerCert
                    ? this.tipos.filter((x) => x.sigla === c.tipo)[0].nombre
                    : 'Carrera';
                } else {
                  const careerInfo = this.careerService.obtenerCarrera(c.courseId)
                    .valueChanges()
                    .subscribe(carrera => {
                      if (carrera) {
                        val = 1;
                        c.fechaFin = this.formatDate(c.fechaFin);
                        c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
                        c.vence = carrera.vence;
                        c.vencimiento = carrera.vencimiento;
                        c.tipo = !c.careerCert
                          ? this.tipos.filter((x) => x.sigla === c.tipo)[0].nombre
                          : 'Carrera';
                      }
                      careerInfo.unsubscribe();
                    });
                }
                if (val === 0) {
                  c.fechaFin = this.formatDate(c.fechaFin);
                  c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
                  c.vence = true;
                  c.tipo = !c.careerCert
                    ? this.tipos.filter((x) => x.sigla === c.tipo)[0].nombre
                    : 'Carrera';
                }
                courseInfo.unsubscribe();
              });
          });
          this.certReceived = cert;
          this.show = true;
          this.myInputField.nativeElement.focus();
          this.myInputField.nativeElement.select();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se encontraron certificados con los datos ingresados.',
            confirmButtonText: 'cerrar',
          }).then(() => {
            this.show = false;
            this.myInputField.nativeElement.focus();
            this.myInputField.nativeElement.select();
          });
        }
        userCert.unsubscribe();
      });
  }

  formatDate(date): string {
    const f = new Date(date.seconds * 1000).toLocaleDateString();
    return f;
  }
}
