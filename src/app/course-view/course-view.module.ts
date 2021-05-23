import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseViewRoutingModule } from './course-view-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationComponent } from './components/navigation/navigation.component';


@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    CourseViewRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ]
})
export class CourseViewModule { }
