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
import { CourseEditComponent } from './components/cursos/course-edit/course-edit.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { CourseDescriptionComponent } from './components/cursos/course-description/course-description.component';
import { CourseHomeComponent } from './components/cursos/course-home/course-home.component';
import { LeccionesComponent } from './components/lessons/lecciones/lecciones.component';
import { LessonCreateComponent } from './components/lessons/lesson-create/lesson-create.component';



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
    CourseEditComponent,
    CourseDescriptionComponent,
    CourseHomeComponent,
    LeccionesComponent,
    LessonCreateComponent,
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    EditorModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    
  ]
})
export class DashboardModule { }
