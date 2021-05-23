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
import { CourseHomeComponent } from './components/cursos/course-home/course-home.component';
import { LeccionesComponent } from './components/lessons/lecciones/lecciones.component';
import { LessonCreateComponent } from './components/lessons/lesson-create/lesson-create.component';
import { LessonConfigComponent } from './components/lessons/lesson-config/lesson-config.component';
import { LessonContentListComponent } from './components/lessons/lesson-content-list/lesson-content-list.component';
import { LoginGuard } from '../home/components/auth/login/guards/login.guard';
import { AdsListComponent } from './components/ads/ads-list/ads-list.component';
import { AdsCreateComponent } from './components/ads/ads-create/ads-create.component';
import { ExercisesListComponent } from './components/exercises/exercises-list/exercises-list.component';
import { ExercisesCreateComponent } from './components/exercises/exercises-create/exercises-create.component';
import { AdsEditComponent } from './components/ads/ads-edit/ads-edit.component';
import { CourseRegistrationComponent } from './components/course-registration/course-registration.component';
import { LessonsComponent } from './components/course-registration/lessons/lessons.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    canActivate:[LoginGuard],
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
        path: 'cursos/index/:id',
        component: CourseHomeComponent
      },
      {
        path: 'cursos/lecciones/create',
        component: LessonCreateComponent
      },
      {
        path: 'cursos/:cid/lecciones/config/:lid/:contentId',
        component: LessonConfigComponent
      },
      {
        path: 'cursos/:cid/lecciones/content-list/:lid',
        component: LessonContentListComponent
      },
      {
        path: 'cursos/lecciones/:id',
        component: LeccionesComponent
      },
      {
        path: 'cursos/ejercicios/:courseId',
        component: ExercisesListComponent
      },
      {
        path: 'cursos/ejercicios/crear/:courseId',
        component: ExercisesCreateComponent
      },
      {
        path: 'cursos/ejercicios/editar/:courseId/:exerciseId',
        component: ExercisesCreateComponent
      },
      {
        path: 'categorias',
        component: CategoriesComponent
      },
      {
        path: 'categorias/create',
        component: CategoryCreateComponent
      },
      {
        path: 'categorias/edit/:id',
        component: CategoryCreateComponent
      },
      {
        path: 'ads/ads-list',
        component: AdsListComponent
      },
      {
        path: 'ads/ads-create',
        component: AdsCreateComponent
      },
      {
        path: 'ads/ads-edit/:id',
        component: AdsEditComponent
      },
      {
        path: 'course-registration',
        component: CourseRegistrationComponent
      },
      {
        path: 'course-registration/lessons/:id',
        component: LessonsComponent,
      }
    ]
  },
  {
    path: 'course-view',
    loadChildren: () => import('../course-view/course-view.module').then((d) => d.CourseViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
