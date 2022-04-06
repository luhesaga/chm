import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject, Subject } from 'rxjs';
import { CertificateDesignService } from '../../../../core/services/certificate-design/certificate-design.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adm-design-certificate',
  templateUrl: './adm-design-certificate.component.html',
  styleUrls: ['./adm-design-certificate.component.scss']
})
export class AdmDesignCertificateComponent implements OnInit {

  @ViewChild('tituloRef') titulo: ElementRef;
  certificado: any;
  contenido: any;
  private editorSubject: Subject<any> = new AsyncSubject();

  designId: string;
  edit = false;

  constructor(
    private createCert: CertificateDesignService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.designId = this.activatedRoute.snapshot.params.designId;
    console.log(this.designId);
    if (this.designId) {
      this.edit = true;
    }
    console.log(this.edit);
  }

  ngOnInit(): void {
    if (this.edit) {
      this.getCertDesign();
    }
  }

  getCertDesign(): void {
    const certDesign = this.createCert.getDesign(this.designId)
      .valueChanges()
      .subscribe(cert => {
        console.log(cert);
        this.certificado = cert.contenido;
        this.titulo.nativeElement.value = cert.titulo;
        certDesign.unsubscribe();
      });
  }

  handleEditorInit(e): void {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  saveOrEditDesign(): void {
    const data = {
      id: this.designId,
      titulo: this.titulo.nativeElement.value,
      contenido: this.certificado
    };

    if (!data.titulo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La plantilla debe tener un titulo.',
      });
      this.titulo.nativeElement.focus();
    } else if (!data.contenido) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La plantilla esta vacia.',
      });
    } else {
      if (!this.edit) {
        this.saveCertDesign(data);
      } else {
        this.editCertDesign(data);
      }
    }
  }

  saveCertDesign(data: any): void {
    console.log(this.certificado);
    this.createCert.createCertificate(data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Plantilla creada exitosamente.',
        });
        this.goBack();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error.' + err,
        });
      });
  }

  editCertDesign(data: any): void {
    this.createCert.editCertDesign(data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Plantilla actualizada exitosamente.',
        });
        this.goBack();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error.' + err,
        });
      });
  }

  goBack(): void {
    this.router.navigate([`dashboard/disenos-certificados`]);
  }

}
