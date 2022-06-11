import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PayuService } from 'src/app/core/services/payu/payu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss'],
})
export class CuponsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['cupon', 'descuento', 'fecha', 'actions'];
  dataSource = new MatTableDataSource();

  couponsList;

  constructor(private router: Router, private cupones: PayuService) {}

  ngOnInit(): void {
    this.getCouponsList();
  }

  ngOnDestroy(): void {
    if (this.couponsList) {
      this.couponsList.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCouponsList(): void {
    this.couponsList = this.cupones.listCoupons()
      .valueChanges()
      .subscribe(coupons => {
        coupons.forEach(c => {
          c.fecha = new Date(c.fecha.seconds * 1000).toLocaleDateString();
        });
        this.dataSource.data = coupons;
        // console.log(coupons);
      });
  }

  goToCreate(): void {
    this.router.navigate(['dashboard/crear-cupon']);
  }

  goToEdit(element: any): void {
    this.router.navigateByUrl('dashboard/editar-cupon/' + element.id);
  }

  couponDelete(element): void {
    Swal.fire({
      title: '¿Quieres eliminar el cupón?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cupones.deleteCoupon(element.id)
          .then(() => {
            Swal.fire('Cupón eliminado', '', 'success');
          })
          .catch((err) => {
            Swal.fire('Cupón eliminado', `Error al eliminar ${err}`, 'error');
          });
      }
    })
    .catch(err => console.log(err));
  }
}
