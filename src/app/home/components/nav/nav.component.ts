import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  material = 'main-options';
  sticky = '';
  icon = 'menu';
  menuText = 'Menú';
  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (!result.matches) {
        this.isMobile = true;
        this.sticky = 'mobile-sticky';
      } else {
        this.isMobile = false;
        this.material = 'main-options';
        this.menuText = 'Menú';
        this.icon = 'menu';
        this.sticky = '';
      }
    });

  }

  classToogle() {

    if (this.isMobile) {
      if (this.material === 'main-options') {
        this.material = 'is-active';
        this.icon = 'highlight_off';
        this.menuText = 'Cerrar menú';
      } else {
        this.material = 'main-options';
        this.icon = 'menu';
        this.menuText = 'Menú';
      }
    }
  }

}
