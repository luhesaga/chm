import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { RecoverComponent } from './components/auth/recover/recover.component';
import { ContactComponent } from './components/contact/contact.component';
import { CourseInfoComponent } from './components/courses/course-info/course-info.component';
import { CourseDetailComponent } from './components/courses/course-detail/course-detail.component';
import { MainComponent } from './components/main/main.component';
import { CertValidationComponent } from './components/certificates/cert-validation/cert-validation.component';
import { CarrerasDetailComponent } from '../dashboard/components/carreras/carreras-detail/carreras-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'recover',
        component: RecoverComponent
      },
      {
        path: 'detalle-curso/:id',
        component: CourseDetailComponent
      },
      {
        path: 'validar-certificado',
        component: CertValidationComponent
      },
      {
        path: ':tag',
        component: MainComponent
      },
      {
        path: 'carreras/detail/:idCarreras/:home',
        component: CarrerasDetailComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
