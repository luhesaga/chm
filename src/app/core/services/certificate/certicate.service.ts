import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CerticateService {

  public tipoCert = [
    {
      nombre: 'Certificacion',
      sigla: 'CE'
    },
    {
      nombre: 'Asistencia',
      sigla: 'AS'
    },
    {
      nombre: 'Aprobacion',
      sigla: 'AP'
    },
  ];

  public tecnicas = [
    {
      tipo: 'ASME IX',
      sigla: 'AIX'
    },
    {
      tipo: 'Corrientes de Eddie I',
      sigla: 'ETI'
    },
    {
      tipo: 'Corrientes de Eddie II',
      sigla: 'ETII'
    },
    {
      tipo: 'Emisión Acústica I',
      sigla: 'AEI'
    },
    {
      tipo: 'Emisión Acústica II',
      sigla: 'AEII',
    },
    {
      tipo: 'Espesor Película Seca',
      sigla: 'EPS'
    },
    {
      tipo: 'Inspección Visual I',
      sigla: 'VTI'
    },
    {
      tipo: 'Inspección Visual II',
      sigla: 'VTII'
    },
    {
      tipo: 'Intro a los END',
      sigla: 'IEND'
    },
    {
      tipo: 'Metalurgia del Acero',
      sigla: 'MET'
    },
    {
      tipo: 'Partículas Magnéticas I',
      sigla: 'MTI'
    },
    {
      tipo: 'Partículas Magnéticas II',
      sigla: 'MTII'
    },
    {
      tipo: 'Prueba de Adherencia',
      sigla: 'PAP'
    },
    {
      tipo: 'Prueba de Fuga I',
      sigla: 'LTI'
    },
    {
      tipo: 'Prueba de Fuga II',
      sigla: 'LTII'
    },
    {
      tipo: 'Prueba de Holiday',
      sigla: 'PCH'
    },
    {
      tipo: 'Radiografía I',
      sigla: 'RTI'
    },
    {
      tipo: 'Radiografía II',
      sigla: 'RTII'
    },
    {
      tipo: 'Termografia I',
      sigla: 'IRI',
    },
    {
      tipo: 'Termografia II',
      sigla: 'IRII'
    },
    {
      tipo: 'Tintas Penetrantes I',
      sigla: 'PTI'
    },
    {
      tipo: 'Tintas Penetrantes II',
      sigla: 'PTII'
    },
    {
      tipo: 'Ultrasonido I',
      sigla: 'UTI'
    },
    {
      tipo: 'Ultrasonido II',
      sigla: 'UTII'
    },
  ];

  consecutivo: string;

  constructor(public fireStore: AngularFirestore) { }

  generateCerticate(data, consulta) {
    //console.log(data);
    console.log(consulta);
    let isCertified = this.isCertified(data)
      .valueChanges()
      .subscribe((c: any) => {
        if (c.length === 0) {
          data.fechaNew = new Date();
          this.markAsCertified(data);
        } else {
          data.fecha = c[0].fechaFin;
          data.certificado = c[0].certificado;
        }
        if (consulta) {
          this.downloadPDF(data);
        }
        isCertified.unsubscribe();
      })

  }

  isCertified2(data) {
    return this.fireStore.doc(`certificados/${data.courseId}/estudiantes/${data.stdId}`);
  }

  isCertified(data) {
    return this.fireStore.collection(`certificados`, ref =>
    ref.where('cc', '==', data.cc).where('courseId', '==', data.courseId));
  }

  certificateByCertId(certId: string) {
    return this.fireStore.collection(`certificados`, ref =>
    ref.where('certificado', '==', certId));
  }

  certificateByStdId(stdId: string) {
    return this.fireStore.collection(`certificados`, ref =>
    ref.where('cc', '==', stdId));
  }

  certificatesList() {
    return this.fireStore.collection(`certificados`, ref =>
      ref.orderBy('id'));
  }

  markAsCertified(data) {
    //console.log(data);
    let tipo = this.tipoCert.filter(x => x.nombre === data.tipo)[0].sigla;
    let tecnica = this.tecnicas.filter(x => x.sigla === data.siglaCurso)[0].tipo;
    let fecha = this.setDates(data);
    let consec = this.getConsecutive()
      .valueChanges()
      .subscribe((c: any) => {
        c.valor;
        if (c.valor <= 9) {
          this.consecutivo = `00${c.valor}`;
        } else if (c.valor > 9 && c.valor <= 99 ) {
          this.consecutivo = `0${c.valor}`;
        } else {
          this.consecutivo = `${c.valor}`;
        }
        this.consecutivo = `${tipo}-${data.siglaCurso}-${fecha[0].fecha}-${this.consecutivo}`;
        this.setConsecutive(c.valor + 1)
          .then(() => {
            return this.fireStore.doc(`certificados/${this.consecutivo}`)
              .set({
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
                  tecnica
                });
          })
          .catch(err => console.log(err));
        consec.unsubscribe();
      });
  }

  saveNewCert(data) {
    let tipo = this.tipoCert.filter(x => x.nombre === data.tipo)[0].sigla;
    return this.fireStore.doc(`certificados/${data.certificado}`)
      .set({
        id: data.id,
        cc: data.identificacion,
        certificado: data.certificado,
        fechaFin: data.fechaFin,
        fechaExp: data.tipo !== 'Certificacion' && data.fechaExp ? new Date(data.fechaExp) : null,
        tecnica: data.tecnica.tipo,
        estudiante: data.estudiante,
        tipo,
        observacion: data.observacion,
      });
  }

  updateCert(data) {
    let tipo = this.tipoCert.filter(x => x.nombre === data.tipo)[0].sigla;
    return this.fireStore.doc(`certificados/${data.certId}`)
      .update({
        certificado: data.certificado,
        fechaFin: data.fechaFin,
        fechaExp: data.tipo !== 'certificacion' && data.fechaExp ? new Date(data.fechaExp) : null,
        tecnica: data.tecnica,
        estudiante: data.estudiante,
        tipo,
        observacion: data.observacion,
      })
  }

  setDates(data) :any {
    let fechaCons = new Date(data.fechaNew);
    const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const fecha = `${meses[fechaCons.getMonth()]}${fechaCons.getFullYear().toString().substring(2, 4)}`;
    const fechaExp = new Date (fechaCons.setDate(fechaCons.getDate() + 1095));
    return [{fecha: fecha}, {fecha: fechaExp}];
  }

  downloadPDF(data) {
    // console.log(data);
    let f: any;
    if (data.fecha) {
      f = new Date(data.fecha.seconds * 1000);
    } else if (data.fechaFin) {
      f = new Date(data.fechaFin.seconds * 1000);
    } else {
      f = new Date(data.fechaNew);
    }
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = (f.getDate() + ' de ' + meses[f.getMonth()] + ' de ' + f.getFullYear());
    let text1 = 'Hace constar que';
    let text2 = `Cursó y aprobó satisfactoriamente la acción de formación`;
    let text4 = `ASNT NDT LEVEL II`;
    let text5 = `Director General`;
    let cert = `puede validar este certificado en: https://chym-e-learning.web.app con el código ${data.certificado}`;
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
    doc.text(data.estudiante.toUpperCase(), centerText(data.estudiante), 160);
    doc.setFontSize(12);
    doc.text(data.documento, centerText(data.documento), 175);
    doc.setFontSize(16);
    doc.setTextColor(0, 114, 121);
    doc.text(text2, centerText(text2), 200,);
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
    //doc.text(text4, centerText(text4), 400);
    doc.setFontSize(12);
    doc.setTextColor(55, 71, 79);
    doc.text(cert, centerText(cert), 430);
    //doc.addImage('../../../assets/img/logo-ASNT.png', 'PNG', 450, 340, 100, 90);
    doc.save(`certificado.pdf`);
  }

  getConsecutive() {
    return this.fireStore.doc('consecutivo/contador');
  }

  setConsecutive(val) {
    return this.fireStore.doc('consecutivo/contador')
    .update({
      valor: val
    });
  }
}
