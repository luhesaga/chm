import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CerticateService } from 'src/app/core/services/certificate/certicate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adm-edit-certificate',
  templateUrl: './adm-edit-certificate.component.html',
  styleUrls: ['./adm-edit-certificate.component.scss']
})
export class AdmEditCertificateComponent implements OnInit {

  form: FormGroup;
  certId;

  edit = false;

  stdId;
  cedula;
  courseId;
  curso;
  siglaCurso = 'MET';
  horas;
  profesor;
  cid;

  types: string [] = ['Certificacion', 'Asistencia', 'Aprobacion'];
  selectedType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private certificate: CerticateService,
  ) {
    this.certId = this.activatedRoute.snapshot.params.certificado;
    if (this.certId) {
      this.edit = true;
    }
    this.buildForm()
  }

  ngOnInit(): void {
    this.getCertificate();
  }

  goBack() {
    this.route.navigate(['dashboard/certificados']);
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      certificado: [''],
      fechaFin: [''],
      fechaExp: [''],
      tecnica: [''],
      estudiante: [''],
      tipo: [''],
      observacion: [''],
    })
  }

  getCertificate() {
    if (this.certId) {
      let cert = this.certificate.certificateByCertId(this.certId)
        .valueChanges({idField: 'certId'})
        .subscribe((c: any) => {
          let tipo = this.certificate.tipoCert.filter(x => x.sigla === c[0].tipo)[0].nombre;
          this.certificadoField.setValue(c[0].certificado);
          this.fechaFinField.setValue(c[0].fechaFin ? this.formatDate(c[0].fechaFin) : null);
          this.fechaExpField.setValue(c[0].fechaExp ? this.formatDate(c[0].fechaExp) : null);
          this.tecnicaField.setValue(c[0].tecnica);
          this.estudianteField.setValue(c[0].estudiante);
          this.tipoField.setValue(tipo);
          this.observacionField.setValue(c[0].observacion);
          this.cid = c[0].certId;
          cert.unsubscribe();
        })
    }
  }

  get certificadoField() {
    return this.form.get('certificado');
  }

  get fechaFinField() {
    return this.form.get('fechaFin');
  }

  get fechaExpField() {
    return this.form.get('fechaExp');
  }

  get tecnicaField() {
    return this.form.get('tecnica');
  }

  get estudianteField() {
    return this.form.get('estudiante');
  }

  get tipoField() {
    return this.form.get('tipo');
  }

  get observacionField() {
    return this.form.get('observacion');
  }

  saveOrEditCert(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.certId) {
        this.saveCert()
      } else {
        this.editCert()
      }
    }
  }

  saveCert() {
    const formData = this.form.value;
    const data = this.getCerticateData(formData);
    this.certificate.generateCerticate(data, true);
    this.route.navigate(['dashboard/certificados']);
  }

  editCert() {
    this.form.value.certId = this.cid;
    const data = this.form.value;

    this.form.enable();
    this.certificate.updateCert(data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Certificado actualizado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.goBack();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Ocurrió un error' + error,
          confirmButtonText: 'cerrar',
              });
      });

  }

  getCerticateData (form): any {
    const data = {
      horas: form.horas,
      estudiante: `${form.estudiante}`,
      documento: 'Con documento de identidad ' + this.addCommas(form.cedula),
      profesor: `${form.profesor}`,
      curso: form.curso,
      stdId: form.stdId,
      courseId: form.courseId,
      siglaCurso: form.siglaCurso,
      cc: form.cedula,
      tipo: form.tipo
    }

    return data;
  }

  addCommas(nStr): string {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }

  formatDate(date) {
    const f = new Date(date.seconds * 1000);

    return f;
  }

  typeChanged(event) {
    console.log(event.value);
  }

}
