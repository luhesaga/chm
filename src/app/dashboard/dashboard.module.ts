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
import { LessonConfigComponent } from './components/lessons/lesson-config/lesson-config.component';
import { LessonContentListComponent } from './components/lessons/lesson-content-list/lesson-content-list.component';
import { AdsListComponent } from './components/ads/ads-list/ads-list.component';
import { AdsCreateComponent } from './components/ads/ads-create/ads-create.component';
import { ExercisesListComponent } from './components/exercises/exercises-list/exercises-list.component';
import { ExercisesCreateComponent } from './components/exercises/exercises-create/exercises-create.component';

import { AdsEditComponent } from './components/ads/ads-edit/ads-edit.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { CarouselComponent } from './components/ads/carousel/carousel.component';
import { QuestionCreateComponent } from './components/exercises/questions/question-create/question-create.component';
import { QuestionsListComponent } from './components/exercises/questions/questions-list/questions-list.component';
import { CourseRegistrationComponent } from './components/course-registration/course-registration.component';
import { LessonsComponent } from './components/course-registration/lessons/lessons.component';
import { GlossaryListComponent } from './components/glossary/glossary-list/glossary-list.component';
import { GlossaryCreateComponent } from './components/glossary/glossary-create/glossary-create.component';
import { AddStudentComponent } from './components/cursos/add-student/add-student.component';
import { MatricularComponent } from './components/cursos/add-student/matricular/matricular.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';



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
    LessonConfigComponent,
    LessonContentListComponent,
    AdsListComponent,
    AdsCreateComponent,
    ExercisesListComponent,
    ExercisesCreateComponent,
    AdsEditComponent,
    CarouselComponent,
    QuestionCreateComponent,
    QuestionsListComponent,
    CourseRegistrationComponent,
    LessonsComponent,
    GlossaryListComponent,
    GlossaryCreateComponent,
    AddStudentComponent,
    MatricularComponent,
    UserProfileComponent,
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    EditorModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatCarouselModule.forRoot(),
  ],
  exports: [
    CarouselComponent,
  ]
})
export class DashboardModule { }
