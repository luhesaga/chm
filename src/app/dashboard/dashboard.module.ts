import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './components/main/main.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MaterialModule } from '../material/material.module';
import { UsersComponent } from './components/users/users.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CreateComponent } from './components/cursos/create/create.component';


@NgModule({
  declarations: [MainComponent, NavigationComponent, UsersComponent, CursosComponent, CreateComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    LayoutModule,
  ]
})
export class DashboardModule { }
