import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { RecoverComponent } from './components/auth/recover/recover.component';
import { HeroComponent } from './components/hero/hero.component';
import { CoursesComponent } from './components/courses/courses.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { StarRatingModule } from 'angular-star-rating';
import { CourseInfoComponent } from './components/courses/course-info/course-info.component';
import { MaterialModule } from '../material/material.module';
import { CourseDetailComponent } from './components/courses/course-detail/course-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CertValidationComponent } from './components/certificates/cert-validation/cert-validation.component';
import { CareersComponent } from './components/careers/careers.component';



@NgModule({
  declarations: [
    NavComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    RecoverComponent,
    HeroComponent,
    CoursesComponent,
    FooterComponent,
    ContactComponent,
    CourseInfoComponent,
    CourseDetailComponent,
    MainComponent,
    CertValidationComponent,
    CareersComponent,
  ],
  imports: [
    CommonModule,
    StarRatingModule.forRoot(),
    HomeRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    DashboardModule,
    FormsModule,
  ]
})
export class HomeModule { }
