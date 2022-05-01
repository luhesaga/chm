import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import html2canvas from 'html2canvas';
import { CertificateDesignService } from '../certificate-design/certificate-design.service';

@Injectable({
  providedIn: 'root',
})
export class CerticateService {
  public tipoCert = [
    {
      nombre: 'Certificacion',
      sigla: 'CE',
    },
    {
      nombre: 'Asistencia',
      sigla: 'AS',
    },
    {
      nombre: 'Aprobacion',
      sigla: 'AP',
    },
  ];

  public tecnicas = [
    {
      tipo: 'ASME IX',
      sigla: 'AIX',
    },
    {
      tipo: 'Corrientes de Eddie I',
      sigla: 'ETI',
    },
    {
      tipo: 'Corrientes de Eddie II',
      sigla: 'ETII',
    },
    {
      tipo: 'Emisión Acústica I',
      sigla: 'AEI',
    },
    {
      tipo: 'Emisión Acústica II',
      sigla: 'AEII',
    },
    {
      tipo: 'Espesor Película Seca',
      sigla: 'EPS',
    },
    {
      tipo: 'Inspección Visual I',
      sigla: 'VTI',
    },
    {
      tipo: 'Inspección Visual II',
      sigla: 'VTII',
    },
    {
      tipo: 'Intro a los END',
      sigla: 'IEND',
    },
    {
      tipo: 'Liquidos Penetrantes',
      sigla: 'PT'
    },
    {
      tipo: 'Metalurgia del Acero',
      sigla: 'MET',
    },
    {
      tipo: 'Partículas Magnéticas I',
      sigla: 'MTI',
    },
    {
      tipo: 'Partículas Magnéticas II',
      sigla: 'MTII',
    },
    {
      tipo: 'Prueba de Adherencia',
      sigla: 'PAP',
    },
    {
      tipo: 'Prueba de Fuga I',
      sigla: 'LTI',
    },
    {
      tipo: 'Prueba de Fuga II',
      sigla: 'LTII',
    },
    {
      tipo: 'Prueba de Holiday',
      sigla: 'PCH',
    },
    {
      tipo: 'QA/QC Soldadura',
      sigla: 'QAC',
    },
    {
      tipo: 'Radiografía I',
      sigla: 'RTI',
    },
    {
      tipo: 'Radiografía II',
      sigla: 'RTII',
    },
    {
      tipo: 'Termografia I',
      sigla: 'IRI',
    },
    {
      tipo: 'Termografia II',
      sigla: 'IRII',
    },
    {
      tipo: 'Tintas Penetrantes I',
      sigla: 'PTI',
    },
    {
      tipo: 'Tintas Penetrantes II',
      sigla: 'PTII',
    },
    {
      tipo: 'Ultrasonido I',
      sigla: 'UTI',
    },
    {
      tipo: 'Ultrasonido II',
      sigla: 'UTII',
    },
  ];

  consecutivo: string;

  constructor(
    public fireStore: AngularFirestore,
    private certDesign: CertificateDesignService,
  ) {}

  generateCerticate(data, consulta): any {
    // console.log(data);
    const isCertified = this.isCertified(data)
      .valueChanges()
      .subscribe((c: any) => {
        // console.log(c);
        if (c.length === 0) {
          data.fechaNew = new Date();
          this.markAsCertified(data);
        } else {
          data.fecha = c[0].fechaFin;
          data.fechaExp = c[0].fechaExp;
          data.certificado = c[0].certificado;
        }
        if (consulta) {
          if (data.plantilla === 'default') {
            this.downloadPDF(data);
          } else {
            this.getCertDesign(data);
          }
        }
        isCertified.unsubscribe();
      });
  }

  isCertified2(data): AngularFirestoreDocument {
    return this.fireStore.doc(
      `certificados/${data.courseId}/estudiantes/${data.stdId}`
    );
  }

  isCertified(data): AngularFirestoreCollection {
    return this.fireStore.collection(`certificados`, (ref) =>
      ref.where('cc', '==', data.cc).where('courseId', '==', data.courseId)
    );
  }

  certificateByCertId(certId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`certificados`, (ref) =>
      ref.where('certificado', '==', certId)
    );
  }

  certificateByStdId(stdId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`certificados`, (ref) =>
      ref.where('cc', '==', stdId)
    );
  }

  certificatesList(): AngularFirestoreCollection {
    return this.fireStore.collection(`certificados`, (ref) =>
      ref.orderBy('id')
    );
  }

  markAsCertified(data): void {
    // console.log(data);
    const tipo = this.tipoCert.filter((x) => x.nombre === data.tipo)[0].sigla;
    // const tecnica = this.tecnicas
    //   .filter((x) => x.sigla === data.siglaCurso)[0].tipo;
    const tecnica = data.curso;
    const fecha = this.setDates(data);
    const consec = this.getConsecutive()
      .valueChanges()
      .subscribe((c: any) => {
        if (c.valor <= 9) {
          this.consecutivo = `00${c.valor}`;
        } else if (c.valor > 9 && c.valor <= 99) {
          this.consecutivo = `0${c.valor}`;
        } else {
          this.consecutivo = `${c.valor}`;
        }
        this.consecutivo = `${tipo}-${fecha[0].fecha}-${this.consecutivo}-${data.siglaCurso}`;
        this.setConsecutive(c.valor + 1)
          .then(() => {
            return this.fireStore.doc(`certificados/${this.consecutivo}`).set({
              id: c.valor,
              stdId: data.stdId,
              estudiante: data.estudiante,
              fechaFin: data.fechaNew,
              fechaExp: data.tipo !== 'certificacion' ? fecha[1].fecha : null,
              horas: data.horas,
              cc: data.cc,
              documento: data.documento,
              profesor: data.profesor,
              curso: data.curso,
              courseId: data.courseId,
              certificado: this.consecutivo,
              tipo,
              tecnica,
            });
          })
          .catch((err) => console.log(err));
        consec.unsubscribe();
      });
  }

  saveNewCert(data): Promise<void> {
    const tipo = this.tipoCert.filter((x) => x.nombre === data.tipo)[0].sigla;
    return this.fireStore.doc(`certificados/${data.certificado}`).set({
      id: data.id,
      cc: data.identificacion,
      certificado: data.certificado,
      fechaFin: data.fechaFin,
      fechaExp:
        data.tipo !== 'Certificacion' && data.fechaExp
          ? new Date(data.fechaExp)
          : null,
      tecnica: data.tecnica.tipo,
      estudiante: data.estudiante,
      tipo,
      observacion: data.observacion,
    });
  }

  updateCert(data): Promise<void> {
    let tipo: string;
    if (data.tipo !== 'Carrera') {
      tipo = this.tipoCert.filter((x) => x.nombre === data.tipo)[0].sigla;
    } else {
      tipo = 'CAR';
    }
    return this.fireStore.doc(`certificados/${data.certId}`).update({
      certificado: data.certificado,
      cc: data.identificacion,
      fechaFin: data.fechaFin,
      fechaExp:
        data.tipo !== 'certificacion' && data.fechaExp
          ? new Date(data.fechaExp)
          : null,
      tecnica: data.tecnica,
      estudiante: data.estudiante,
      tipo,
      observacion: data.observacion ? data.observacion : '',
    });
  }

  setDates(data): any {
    const fechaCons = new Date(data.fechaNew);
    const meses = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const fecha = `${fechaCons.getFullYear().toString().substring(2, 4)}${
      meses[fechaCons.getMonth()]
    }`;
    let dias;
    if (data.vence) {
      dias = 365 * data.vencimiento;
    } else {
      dias = 365 * 5;
    }
    const fechaExp = new Date(fechaCons.setDate(fechaCons.getDate() + dias));
    const ultimoDia = new Date(fechaExp.getFullYear(), fechaExp.getMonth() + 1, 0);
    return [{ fecha }, { fecha: ultimoDia }];
  }

  downloadPDF(data): void {
    let f: any;
    if (data.fecha) {
      f = new Date(data.fecha.seconds * 1000);
    } else if (data.fechaFin) {
      f = new Date(data.fechaFin.seconds * 1000);
    } else {
      f = new Date(data.fechaNew);
    }
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const fecha =
      f.getDate() + ' de ' + meses[f.getMonth()] + ' de ' + f.getFullYear();
    const text1 = 'Hace constar que';
    const text2 = `Cursó y aprobó satisfactoriamente la acción de formación`;
    const text4 = `ASNT NDT LEVEL II`;
    const text5 = `Director General`;
    const cert = `puede validar este certificado en: https://chym-e-learning.web.app con el código ${data.certificado}`;
    const doc = new jsPDF({
      orientation: 'l',
      format: 'letter',
      unit: 'px',
    });
    // Funcion para centrar los textos
    const centerText = (text: string) => {
      const fontSize = doc.getFontSize();
      const pageWidth = doc.internal.pageSize.width;
      const txtWidth =
        (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
      return Math.ceil((pageWidth - txtWidth) / 2);
    };
    doc.setFillColor(236, 239, 241);
    doc.rect(0, 0, 756, 612, 'F');
    doc.addImage(
      '../../../assets/img/certificate-banner.png',
      'PNG',
      20,
      3,
      580,
      80
    );
    doc.addImage(
      '../../../assets/img/certificate-lines.png',
      'PNG',
      3,
      3,
      70,
      450
    );
    doc.setFontSize(16);
    doc.setTextColor(0, 114, 121);
    doc.text(text1, centerText(text1), 110);
    doc.setFontSize(28);
    doc.setTextColor(55, 71, 79);
    doc.text(data.estudiante.toUpperCase(), centerText(data.estudiante), 160);
    doc.setFontSize(12);
    doc.text(data.documento, centerText(data.documento), 175);
    doc.setFontSize(16);
    doc.setTextColor(0, 114, 121);
    doc.text(text2, centerText(text2), 200);
    doc.setFontSize(28);
    doc.setTextColor(55, 71, 79);
    doc.text(data.curso, centerText(data.curso), 235);
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 121);
    doc.text(`Realizado:`, 100, 295);
    doc.setTextColor(55, 71, 79);
    doc.text(fecha, 160, 295);
    doc.setTextColor(0, 114, 121);
    doc.text(`Duracion:`, 380, 295);
    doc.setTextColor(55, 71, 79);
    doc.text(`${data.horas} HORAS`, 440, 295);
    doc.setTextColor(0, 114, 121);
    doc.text(`Lugar:`, 380, 315);
    doc.setTextColor(55, 71, 79);
    doc.text(`Barranquilla - Colombia`, 430, 315);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text(data.profesor, centerText(data.profesor), 380);
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 121);
    doc.setFont('times', 'normal');
    doc.text(text5, centerText(text5), 395);
    doc.setFontSize(12);
    doc.setTextColor(55, 71, 79);
    doc.text(cert, centerText(cert), 430);
    doc.save(`certificado.pdf`);
  }

  getCertDesign(data): void {
    // console.log(data);
    const design = this.certDesign.getUniqueDesign(data.plantilla)
      .valueChanges()
      .subscribe(d => {
        this.prepareCert(data, d);
        design.unsubscribe();
      });
  }

  prepareCert(data, cert): void {
    // console.log(cert);
    // console.log(data);
    let dias;
    if (data.vence) {
      dias = data.vencimiento * 365;
    } else {
      dias = 365 * 5;
    }
    const contenido = cert[0].contenido
      .replace('##STD_NAME##', `${data.estudiante}`)
      .replace('##STD_ID##', `${data.documento2 ? data.documento2 : this.addCommas(data.cc)}`)
      .replace('##CAREER_NAME##', data.curso)
      .replace('##INI_DATE##', this.formatDate(data.fecha ? data.fecha : data.fechaFin))
      .replace('##END_DATE##', this.fixDates(data.fechaExp, dias))
      .replace('##HOURS##', data.horas + ' Horas')
      .replace('##CERTIFICATE##', data.certificado);
    const elemento = document.getElementById('element');
    elemento.innerHTML = contenido;
    elemento.style.display = 'block';
    this.downloadDesignCert(elemento);
    elemento.style.display = 'none';

  }

  formatDate(date): string {
    const fecha = new Date(date.seconds * 1000).toLocaleDateString();
    return fecha;
  }

  addCommas(nStr): string {
    nStr += '';
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }

  downloadDesignCert(elemento): void {
    html2canvas(elemento, { allowTaint: true, useCORS: true }).then(canvas => {
      // Few necessary setting options
      const imgWidth = 280;
      // const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      // const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'letter');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('certificado.pdf'); // Generated PDF
    });
  }

  getConsecutive(): AngularFirestoreDocument {
    return this.fireStore.doc('consecutivo/contador');
  }

  setConsecutive(val): Promise<void> {
    return this.fireStore.doc('consecutivo/contador').update({
      valor: val,
    });
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
}
