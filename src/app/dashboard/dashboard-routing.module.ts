import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursosComponent } from './components/cursos/cursos.component';
import { MainComponent } from './components/main/main.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UsersComponent } from './components/users/users.component';
import { CourseDetailComponent } from '../home/components/courses/course-detail/course-detail.component';
import { CreateComponent } from './components/cursos/create/create.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { CourseEditComponent } from './components/cursos/course-edit/course-edit.component';
import { CourseDescriptionComponent } from './components/cursos/course-description/course-description.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'usuarios',
        component: UsersComponent
      },
      {
        path: 'usuarios/edit',
        component: UserEditComponent
      },
      {
        path: 'cursos',
        component: CursosComponent
      },
      {
        path: 'cursos/create',
        component: CreateComponent
      },
      {
        path: 'cursos/edit',
        component: CourseEditComponent
      },
      {
        path: 'cursos/course-edit/:id',
        component: CreateComponent
      },
      {
        path: 'cursos/detail/:id',
        component: CourseDetailComponent
      },
      {
        path: 'categorias',
        component: CategoriesComponent
      },
      {
        path: 'categorias/create',
        component: CategoryCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
