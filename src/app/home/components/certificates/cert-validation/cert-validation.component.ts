import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CerticateService } from 'src/app/core/services/certificate/certicate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cert-validation',
  templateUrl: './cert-validation.component.html',
  styleUrls: ['./cert-validation.component.scss']
})
export class CertValidationComponent implements OnInit {

  @ViewChild("myinput") myInputField: ElementRef;
  validationForm: FormGroup;
  certReceived: any = [];
  show = false;
  tipos: any;

  constructor(
    private formBuilder: FormBuilder,
    private certificados: CerticateService,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.tipos = this.certificados.tipoCert;
  }

  private buildForm(): void {
    this.validationForm = this.formBuilder.group({
      certificado: ['', Validators.required,],
    })
  }

  get certificadoField() {
    return this.validationForm.get('certificado');
  }

  validateCert(event: Event) {
    event.preventDefault();
    this.certReceived.length = 0;
	  this.validationForm.markAllAsTouched();
    const data = this.validationForm.value.certificado;
    let certificate = this.certificados.certificateByCertId(data)
      .valueChanges()
      .subscribe((cert: any) => {
        if (cert.length > 0) {
          cert.forEach(c => {
            c.fechaFin = this.formatDate(c.fechaFin);
            c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
            c.tipo = c.tipo ? this.tipos.filter(x => x.sigla === c.tipo)[0].nombre : 'Carrera';
          });
          this.certReceived = cert;
          this.show = true;
          this.myInputField.nativeElement.focus();
          this.myInputField.nativeElement.select();
        } else {
          this.getCertBystdId(data);
        }
        certificate.unsubscribe();
      })
  }

  getCertBystdId(cc) {
    let userCert = this.certificados.certificateByStdId(cc)
      .valueChanges()
      .subscribe((cert: any) => {
        if (cert.length > 0) {
          cert.forEach(c => {
            c.fechaFin = this.formatDate(c.fechaFin);
            c.fechaExp = c.fechaExp ? this.formatDate(c.fechaExp) : '';
            c.tipo = c.tipo ? this.tipos.filter(x => x.sigla === c.tipo)[0].nombre : 'Carrera';
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
      })
  }

  formatDate(date) {
    // console.log(date);
    const f = new Date(date.seconds * 1000).toLocaleDateString();
    return f;
  }

}
