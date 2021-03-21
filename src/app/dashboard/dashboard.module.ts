import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './components/main/main.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MaterialModule } from '../material/material.module';
import { UsersComponent } from './components/users/users.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CreateComponent } from './components/cursos/create/create.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';



@NgModule({
  declarations: [
    MainComponent,
    NavigationComponent,
    UsersComponent,
    CursosComponent,
    CreateComponent,
    CategoriesComponent,
    CategoryCreateComponent,
    UserEditComponent,
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
