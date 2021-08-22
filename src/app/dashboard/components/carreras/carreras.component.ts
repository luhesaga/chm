import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarrerasService } from 'src/app/core/services/carreras/carreras.service';

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
    private carrerasService: CarrerasService
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

}
