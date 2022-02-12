import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CareerCertService {
  consecutivo: string;

  constructor(public fireStore: AngularFirestore) {}

  generateCerticate(data, consulta): any {
    // console.log(data);
    // console.log(consulta);
    const isCertified = this.isCertified(data)
      .valueChanges()
      .subscribe((c: any) => {
        if (c.length === 0) {
          data.fechaNew = new Date();
          this.markAsCertified(data);
        } else {
          data.fecha = c[0].fechaFin;
          data.certificado = c[0].certificado;
          // console.log(c);
        }
        if (consulta) {
          this.downloadPDF(data);
        }
        isCertified.unsubscribe();
      });
  }

  isCertified(data): AngularFirestoreCollection {
    return this.fireStore.collection(`certificados`, (ref) =>
      ref.where('cc', '==', data.cc).where('courseId', '==', data.careerId)
    );
  }

  markAsCertified(data): void {
    // console.log(data);
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
        this.consecutivo = `CAR-${data.siglaCarrera}-${fecha[0].fecha}-${this.consecutivo}`;
        console.log(this.consecutivo);
        this.setConsecutive(c.valor + 1)
          .then(() => {
            return this.fireStore.doc(`certificados/${this.consecutivo}`).set({
              id: c.valor,
              stdId: data.stdId,
              estudiante: data.estudiante,
              fechaFin: data.fechaNew,
              fechaExp: fecha[1].fecha,
              horas: data.horas,
              cc: data.cc,
              documento: data.documento,
              // profesor: data.profesor,
              carrera: data.career,
              courseId: data.careerId,
              certificado: this.consecutivo,
              careerCert: true,
            });
          })
          .catch((err) => console.log(err));
        consec.unsubscribe();
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
    const fechaExp = new Date(fechaCons.setDate(fechaCons.getDate() + 1095));
    return [{ fecha }, { fecha: fechaExp }];
  }

  downloadPDF(data): void {
    // console.log(data);
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
    const carrera = data.career ? data.career : data.carrera;
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
    doc.text(carrera, centerText(carrera), 235);
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 121);
    doc.text(`Realizado:`, 100, 295);
    doc.setTextColor(55, 71, 79);
    doc.text(fecha, 160, 295);
    doc.setTextColor(0, 114, 121);
    doc.text(`Duracion:`, 380, 295);
    doc.setTextColor(55, 71, 79);
    doc.text(`${data.horas.toUpperCase()}`, 440, 295);
    doc.setTextColor(0, 114, 121);
    doc.text(`Lugar:`, 380, 315);
    doc.setTextColor(55, 71, 79);
    doc.text(`Barranquilla - Colombia`, 430, 315);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Geovanny Alvarez G.', centerText('Geovanny Alvarez G.'), 380);
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 121);
    doc.setFont('times', 'normal');
    doc.text(text5, centerText(text5), 395);
    doc.setFontSize(12);
    doc.setTextColor(55, 71, 79);
    doc.text(cert, centerText(cert), 430);
    doc.save(`certificado.pdf`);
  }

  getConsecutive(): AngularFirestoreDocument {
    return this.fireStore.doc('consecutivo/contador');
  }

  setConsecutive(val): Promise<void> {
    return this.fireStore.doc('consecutivo/contador').update({
      valor: val,
    });
  }
}
