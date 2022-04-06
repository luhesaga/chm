import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../adm-design-list/adm-design-list.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-adm-design-view',
  templateUrl: './adm-design-view.component.html',
  styleUrls: ['./adm-design-view.component.scss']
})
export class AdmDesignViewComponent implements OnInit {

  std: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((u) => {
      this.std = u;
      this.parseHTML(u);
    });
  }

  parseHTML(u): void {
    const html = this.data.contenido
      .replace('##STD_NAME##', `${u.nombres} ${u.apellidos}`)
      .replace('##STD_ID##', `${u.identificacion}`);
    const ads = document.getElementById('design-content');
    ads.innerHTML = html;
  }

  downloadPDF(): void {
    const elemento = document.getElementById('design-content');

    html2canvas(elemento, { allowTaint: true, useCORS: true }).then(canvas => {
      // Few necessary setting options
      const imgWidth = 280;
      // const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      console.log(`${canvas.height} * ${imgWidth} / ${canvas.width}`);
      console.log(imgHeight);
      // const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'letter');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('certificado.pdf'); // Generated PDF
    });
  }

}
