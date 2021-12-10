import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { MatDialog } from '@angular/material/dialog';
import { DescripcionCarreraComponent } from './descripcion-carrera/descripcion-carrera.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.scss'],
})
export class CarrerasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private carrerasService: CarrerasService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerCarreras(): void {
    this.carrerasService
      .obtenerCarreras()
      .valueChanges()
      .subscribe((carreras) => (this.dataSource.data = carreras));
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(id: string): void {
    const config = {
      data: {
        id,
      },
      height: '40rem',
      width: '50rem',
    };
    this.dialog.open(DescripcionCarreraComponent, config);
  }

  goToCareerDetail(career): void {
    this.router.navigate([`dashboard/carreras/index/${career.id}/${'admin'}`]);
  }
}
