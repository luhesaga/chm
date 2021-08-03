import { Component, OnInit } from '@angular/core';
import { MatCarousel, MatCarouselComponent } from '@ngbmodule/material-carousel';
import { AdsService } from '../../../../core/services/ads/ads.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  listAds:any[];
  constructor(
    private adsService: AdsService
  ) { }

  ngOnInit(): void {
    this.listAdsService();
  }

  listAdsService()
  {
    this.adsService.listAds()
    .valueChanges()
    .subscribe(listAds => {
      this.filtrarAnuncios(listAds);
    });
  }

  filtrarAnuncios(listAds:any[])
  {
    const fechaActual = new Date();
    fechaActual.setHours(0,0,0);
    this.listAds = listAds.filter(ads =>{
      const fechaCaducidad =ads.fechaCaducidad.toDate();
      return fechaCaducidad > fechaActual;
    });
  }

}
