import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CertificateDesignService } from 'src/app/core/services/certificate-design/certificate-design.service';
import { AdmDesignViewComponent } from '../adm-design-view/adm-design-view.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export interface DialogData {
  contenido: string;
  titulo: string;
}

@Component({
  selector: 'app-adm-design-list',
  templateUrl: './adm-design-list.component.html',
  styleUrls: ['./adm-design-list.component.scss'],
})
export class AdmDesignListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = ['no', 'nombre', 'actions'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('content') content!: ElementRef;

  designsReceived: any;

  std: any;

  constructor(
    private createCert: CertificateDesignService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getdesigns();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.designsReceived) {
      this.designsReceived.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getdesigns(): void {
    this.designsReceived = this.createCert
      .listCertsDesigns()
      .valueChanges()
      .subscribe((certs: any) => {
        if (certs.length > 0) {
          certs.forEach((cert, id) => {
            cert.no = id + 1;
          });
          this.dataSource.data = certs;
        }
      });
  }

  openModalVista(element: any): void {
    const dialogRef = this.dialog.open(AdmDesignViewComponent, {
      width: '95%',
      height: '40rem',
      data: {
        contenido: element.contenido,
        titulo: element.titulo,
      },
    });
  }

  goToEdit(element: any): void {
    this.router.navigate([`dashboard/editar-diseno/${element.id}`]);
  }

  deleteDesign(element: any): void {
    Swal.fire({
      icon: 'question',
      text: '¿Seguro que desea eliminar el certificado?',
      confirmButtonText: 'Si',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.value) {
        this.createCert
          .deleteCertDesign(element.id)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Exito',
              text: 'Certificado eliminado exitosamente.',
            });
          })
          .catch((err) => console.log(err));
      }
    });
  }
}
