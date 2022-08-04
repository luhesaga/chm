import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CerticateService } from 'src/app/core/services/certificate/certicate.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adm-list-certificates',
  templateUrl: './adm-list-certificates.component.html',
  styleUrls: ['./adm-list-certificates.component.scss'],
})
export class AdmListCertificatesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'no',
    'certificado',
    'fechaI',
    'fechaE',
    'tecnica',
    'cliente',
    'tipo',
    'observacion',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  certsReceived;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private certificados: CerticateService, private router: Router) {}

  ngOnInit(): void {
    this.getCertificates();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.certsReceived) {
      this.certsReceived.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCertificates(): void {
    this.certsReceived = this.certificados
      .certificatesList()
      .valueChanges()
      .subscribe((c: any) => {
        c.forEach((ce) => {
          ce.fechaFin = ce.fechaFin ? this.formatDate(ce.fechaFin) : null;
          ce.fechaExp = ce.fechaExp ? this.formatDate(ce.fechaExp) : 'n/a';
        });
        this.dataSource.data = c;
      });
  }

  goToHome(): void {}

  goToEdit(data): void {
    this.router.navigate([`dashboard/editar-certificado/${data.certificado}`]);
  }

  deleteCert(element): void {
    // console.log(element);
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara definitivamente este certificado! ¿Esta seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    })
      .then((result) => {
        if (result.value) {
          this.certificados
            .deleteCert(element.certificado)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Certificado eliminado exitosamente',
                confirmButtonText: 'cerrar',
              });
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
      })
      .catch((error) => console.log(error));
  }

  formatDate(date): string {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
}
