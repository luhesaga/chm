import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';
import { MatDialog } from '@angular/material/dialog';
import { DescripcionCarreraComponent } from './descripcion-carrera/descripcion-carrera.component';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.scss']
})
export class CarrerasComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private carrerasService: CarrerasService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerCarreras()
  {
    this.carrerasService.obtenerCarreras()
    .valueChanges()
    .subscribe(carreras => this.dataSource.data=carreras);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(id:string): void
  {
    const config ={
      data:{
        id
      },
      height: '30rem',
      width: '40rem',
    };
    this.dialog.open(DescripcionCarreraComponent, config);
  }

}
