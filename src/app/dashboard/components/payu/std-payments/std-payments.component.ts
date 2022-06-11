import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PayuService } from 'src/app/core/services/payu/payu.service';

@Component({
  selector: 'app-std-payments',
  templateUrl: './std-payments.component.html',
  styleUrls: ['./std-payments.component.scss']
})
export class StdPaymentsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'referencia',
    'moneda',
    'valor',
    'metodo',
    'tipo',
    'fecha',
    'estado',
  ];
  dataSource = new MatTableDataSource();

  paymentsList;
  stdId;
  payments = false;

  constructor(
    private pagosPayu: PayuService,
    private activatedRoute: ActivatedRoute
  ) {
    this.stdId = this.activatedRoute.snapshot.params.stdId;

  }

  ngOnInit(): void {
    this.getPaymentsList();
  }

  ngOnDestroy(): void {
    if (this.paymentsList) {
      this.paymentsList.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPaymentsList(): void {
    this.paymentsList = this.pagosPayu
      .getPaymentByUserId(this.stdId)
      .valueChanges()
      .subscribe((pagos) => {
        if (pagos.length > 0) {
          this.dataSource.data = pagos;
          this.payments = true;
        }
      });
  }

}
