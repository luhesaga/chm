import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UsersService } from '../../../core/services/users/users.service';
import { AdsService } from 'src/app/core/services/ads/ads.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Anuncios', cols: 1, rows: 2 },
          // { title: 'Card 2', cols: 1, rows: 1 },
          // { title: 'Card 3', cols: 1, rows: 1 },
          // { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Anuncios', cols: 2, rows: 2 },
        // { title: 'Card 2', cols: 1, rows: 1 },
        // { title: 'Card 3', cols: 1, rows: 2 },
        // { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  listAds:any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UsersService,
    private adsService: AdsService
    ) { }

  ngOnInit (): void
  {
    this.listAdsService();
  }

  listAdsService()
  {
    this.adsService.listAds()
    .valueChanges()
    .subscribe(listAds => this.listAds = listAds);
  }
}
