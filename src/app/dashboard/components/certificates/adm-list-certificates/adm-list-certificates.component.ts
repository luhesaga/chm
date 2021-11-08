import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CerticateService } from 'src/app/core/services/certificate/certicate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-list-certificates',
  templateUrl: './adm-list-certificates.component.html',
  styleUrls: ['./adm-list-certificates.component.scss']
})
export class AdmListCertificatesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] =
    ['no', 'certificado', 'fechaI', 'fechaE', 'tecnica', 'cliente', 'tipo', 'observacion', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private certificados: CerticateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCertificates();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCertificates() {
    let cert = this.certificados.certificatesList()
      .valueChanges()
      .subscribe((c: any) => {
        c.forEach(ce => {
          ce.fechaFin = this.formatDate(ce.fechaFin);
          ce.fechaExp = ce.fechaExp ? this.formatDate(ce.fechaExp) : 'n/a';
        });
        this.dataSource.data = c;
        cert.unsubscribe();
      })
  }

  goToHome() {}

  goToEdit(data) {
    this.router.navigate([`dashboard/editar-certificado/${data.certificado}`]);
  }

  formatDate(date) {
    const fecha = new Date(date.seconds * 1000).toLocaleDateString();
    return fecha;
  }

}
