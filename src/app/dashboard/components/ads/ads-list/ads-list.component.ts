import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AdsService } from 'src/app/core/services/ads/ads.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss'],
})
export class AdsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(
    private fireStorage: AngularFireStorage,
    private adsService: AdsService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.listAds();
  }

  listAds(): void {
    this.adsService
      .listAds()
      .valueChanges()
      .subscribe((ads) => {
        this.dataSource.data = ads;
      });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToEdit(element: any): void {
    this.router.navigateByUrl('dashboard/ads/ads-edit/' + element.id);
  }

  getAdsToDelete(element: any): void {
    Swal.fire({
      title: '¿Quieres eliminar el anuncio?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAds(element);
      }
    });
  }
  deleteAds(element: any): void {
    this.deleteImage(element.id, element.nombreImg);
    this.deleteCollectionAds(element.id);
  }

  deleteCollectionAds(id: string): void {
    this.adsService.deleteAds(id).then(() => {
      Swal.fire('Anuncio eliminado', '', 'success');
    });
  }

  deleteImage(id: string, nameImage: string): void {
    const imageLocation = `ads/${id}/${nameImage}`;
    this.fireStorage.ref(imageLocation).delete();
  }
}
