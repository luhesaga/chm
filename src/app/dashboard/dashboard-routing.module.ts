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
import { QuestionCreateComponent } from './components/exercises/questions/question-create/question-create.component';
import { QuestionsListComponent } from './components/exercises/questions/questions-list/questions-list.component';
import { CourseRegistrationComponent } from './components/course-registration/course-registration.component';
import { LessonsComponent } from './components/course-registration/lessons/lessons.component';
import { GlossaryListComponent } from './components/glossary/glossary-list/glossary-list.component';
import { GlossaryCreateComponent } from './components/glossary/glossary-create/glossary-create.component';
import { AddStudentComponent } from './components/cursos/add-student/add-student.component';
import { CourseHomeComponentRegistration } from './components/course-registration/course-home/course-home.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { CoursesComponent } from '../home/components/courses/courses.component';
import { VideoConferenceListComponent } from './components/video-conference/video-conference-list/video-conference-list.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AdsCursoComponent } from './components/cursos/ads-curso/ads-curso.component';
import { CreateAdsCursoComponent } from './components/cursos/ads-curso/create-ads-curso/create-ads-curso.component';
import { EditAdsCursoComponent } from './components/cursos/ads-curso/edit-ads-curso/edit-ads-curso.component';
import { ExercisesRevComponent } from './components/exercises/exercises-rev/exercises-rev/exercises-rev.component';
import { ExercisesRevDetailComponent } from './components/exercises/exercises-rev-detail/exercises-rev-detail/exercises-rev-detail.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { CreateCarrerasComponent } from './components/carreras/create-carreras/create-carreras.component';
import { ForumRevComponent } from './components/forum/forum-rev/forum-rev/forum-rev.component';
import { ForumUsersAnswersComponent } from './components/forum/forum-users-answers/forum-users-answers/forum-users-answers.component';
import { ForumRevDetailComponent } from './components/forum/forum-rev-detail/forum-rev-detail/forum-rev-detail.component';
import { EvaluationsHomeComponent } from './components/evaluations/evaluations-home/evaluations-home/evaluations-home.component';
import { EditCarrerasComponent } from './components/carreras/edit-carreras/edit-carreras.component';
import { AddEstudiantesComponent } from './components/carreras/add-estudiantes/add-estudiantes.component';
import { AddCursoComponent } from './components/carreras/add-curso/add-curso.component';
import { CarrerasDetailComponent } from './components/carreras/carreras-detail/carreras-detail.component';
import { CatalogoCarrerasComponent } from './components/carreras/catalogo-carreras/catalogo-carreras.component';
import { MycareersComponent } from './components/mycareers/mycareers.component';


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
        path: 'usuarios/perfil/:idUser',
        component: UserProfileComponent
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
        path: 'cursos/detalle/:id/:userId',
        component: CourseDetailComponent
      },
      {
        path: 'cursos/index/:id',
        component: CourseHomeComponent
      },
      {
        path: 'cursos/index/:id/:stdId',
        component: CourseHomeComponent
      },
      {
        path: 'cursos/list/:userId',
        component: CoursesComponent
      },
      {
        path: 'cursos/anuncios/:idCurso',
        component: AdsCursoComponent
      },
      {
        path: 'cursos/anuncios/estudiante/:idCurso/:stdId',
        component: AdsCursoComponent,
        pathMatch:'full'
      },
      {
        path: 'cursos/anuncios/crear/:idCurso',
        component: CreateAdsCursoComponent,
        pathMatch:'full'
      },
      {
        path: 'cursos/anuncios/editar/:idCurso/:idAnuncio',
        component: EditAdsCursoComponent
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
        path: 'cursos/ejercicios/revisar/:courseId/:exerciseId',
        component: ExercisesRevComponent
      },
      {
        path: 'cursos/ejercicios/revisar/detalle/:courseId/:exerciseId/:testId/:stdId',
        component: ExercisesRevDetailComponent
      },
      {
        path: 'cursos/ejercicios/editar/:courseId/:exerciseId',
        component: ExercisesCreateComponent
      },
      {
        path: 'cursos/ejercicios/:courseId/questions/:exerciseId',
        component: QuestionsListComponent
      },
      {
        path: 'cursos/ejercicios/:courseId/preguntas/add/:exerciseId',
        component: QuestionCreateComponent
      },
      {
        path: 'cursos/ejercicios/:courseId/preguntas/edit/:exerciseId/:questionPosition/:questionType/:answerTrue',
        component: QuestionCreateComponent
      },
      {
        path: 'cursos/evaluaciones/:courseId',
        component: EvaluationsHomeComponent
      },
      {
        path: 'cursos/foros/revisar/:courseId',
        component: ForumRevComponent
      },
      {
        path: 'cursos/foros/revisar/respuestas/:courseId/:lessonId/:forumId',
        component: ForumUsersAnswersComponent
      },
      {
        path: 'cursos/foros/revisar/respuesta-estudiante/:courseId/:lessonId/:forumId/:stdId/:userForumId',
        component: ForumRevDetailComponent
      },
      {
        path: 'cursos/glosario/:courseId',
        component: GlossaryListComponent
      },
      {
        path: 'cursos/glosario/:courseId/:stdId',
        component: GlossaryListComponent
      },
      {
        path: 'cursos/glosario/:courseId/create',
        component: GlossaryCreateComponent
      },
      {
        path: 'cursos/video-meet/:courseId',
        component: VideoConferenceListComponent
      },
      {
        path: 'cursos/video-meet/:courseId/:stdId',
        component: VideoConferenceListComponent
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
        path: 'mis-cursos/:stdId',
        component: CourseRegistrationComponent
      },
      {
        path: 'mis-cursos/lecciones/:courseId/:stdId',
        component: LessonsComponent,
      },
      {
        path: 'mis-carreras/:stdId',
        component: MycareersComponent
      },
      {
        path: 'add-student/:idCurso',
        component: AddStudentComponent,
      },
      {
        path: 'cursos/registration/:idCurso',
        component: CourseHomeComponentRegistration
      },
      {
        path:'documents/:idCurso',
        component:DocumentsComponent
      },
      {
        path:'documents/:idCurso/:idEstudiante',
        component:DocumentsComponent
      },
      {
        path: 'carreras',
        component:CarrerasComponent
      },
      {
        path: 'carreras/create',
        component:CreateCarrerasComponent
      },
      {
        path: 'carreras/edit/:idCarreras',
        component:EditCarrerasComponent
      },
      {
        path: 'carreras/add-estudiantes/:idCarreras',
        component:AddEstudiantesComponent
      },
      {
        path: 'carreras/add-curso/:idCarreras',
        component:AddCursoComponent
      },
      {
        path: 'carreras/detail/:idCarreras',
        component:CarrerasDetailComponent
      },
      {
        path: 'carreras/catalogo/:idUser',
        component:CatalogoCarrerasComponent
      },
      {
        path: 'carreras/detail/:idCarreras/:idUser',
        component:CarrerasDetailComponent
      },
      {
        path: 'carreras/detail/:idCarreras/home/:home',
        component:CarrerasDetailComponent
      }
    ]
  },
  {
    path: 'course-view',
    canActivate:[LoginGuard],
    loadChildren: () => import('../course-view/course-view.module').then((d) => d.CourseViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
