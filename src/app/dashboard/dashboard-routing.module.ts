import { NgModule } from '@angular/core';
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
import { MycareersComponent } from './components/mycareers/mycareers.component';
import { CareerCoursesComponent } from './components/mycareers/career-courses/career-courses.component';
import { StdEvaluationComponent } from './components/evaluations/std-evaluation/std-evaluation.component';
import { StdCerticatesComponent } from './components/certificates/std-certicates/std-certicates.component';
import { AdmEditCertificateComponent } from './components/certificates/adm-edit-certificate/adm-edit-certificate.component';
import { AdmListCertificatesComponent } from './components/certificates/adm-list-certificates/adm-list-certificates.component';
import { AdmCreateCertificateComponent } from './components/certificates/adm-create-certificate/adm-create-certificate.component';
import { CarrerasIndexComponent } from './components/carreras/carreras-index/carreras-index.component';
import { CarrerasLeccionesComponent } from './components/carreras/carreras-lecciones/carreras-lecciones.component';
import { EvaluationHomeComponent } from '../course-view/components/evaluation/evaluation-home/evaluation-home.component';
import { EvaluationFinishComponent } from '../course-view/components/evaluation/evaluation-finish/evaluation-finish.component';
import { CertValidationComponent } from '../home/components/certificates/cert-validation/cert-validation.component';
import { AdmDesignCertificateComponent } from './components/certificates/adm-design-certificate/adm-design-certificate.component';
import { AdmDesignListComponent } from './components/certificates/adm-design-list/adm-design-list.component';
import { CuponsComponent } from './components/payu/cupons/cupons.component';
import { CouponsCreateComponent } from './components/payu/coupons-create/coupons-create.component';
import { CareersComponent } from '../home/components/careers/careers.component';
import { PayuConfirmationComponent } from './components/payu/payu-confirmation/payu-confirmation.component';
import { AdmPaymentsComponent } from './components/payu/adm-payments/adm-payments.component';
import { StdPaymentsComponent } from './components/payu/std-payments/std-payments.component';
import { ChatStdViewComponent } from './components/chat/chat-std-view/chat-std-view.component';
import { ChatTchViewComponent } from './components/chat/chat-tch-view/chat-tch-view.component';
import { ChatTchAnswerComponent } from './components/chat/chat-tch-answer/chat-tch-answer.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'usuarios',
        component: UsersComponent,
      },
      {
        path: 'usuarios/edit',
        component: UserEditComponent,
      },
      {
        path: 'usuarios/perfil/:idUser',
        component: UserProfileComponent,
      },
      {
        path: 'cursos',
        component: CursosComponent,
      },
      {
        path: 'cursos/create',
        component: CreateComponent,
      },
      {
        path: 'cursos/edit',
        component: CourseEditComponent,
      },
      {
        path: 'cursos/course-edit/:id',
        component: CreateComponent,
      },
      {
        path: 'cursos/detail/:id',
        component: CourseDetailComponent,
      },
      {
        path: 'cursos/detalle/:id/:userId',
        component: CourseDetailComponent,
      },
      {
        path: 'cursos/index/:id',
        component: CourseHomeComponent,
      },
      {
        path: 'cursos/index/:id/:stdId',
        component: CourseHomeComponent,
      },
      {
        path: 'cursos-carrera/index/:id/:stdId/:careerId',
        component: CourseHomeComponent,
      },
      {
        path: 'cursos-carrera/index/:id/:stdId/:careerId/:std',
        component: CourseHomeComponent,
      },
      {
        path: 'cursos/chat-std/:courseId/:stdId',
        component: ChatStdViewComponent
      },
      {
        path: 'cursos/chat-adm/:courseId',
        component: ChatTchViewComponent
      },
      {
        path: 'cursos/chat-pregunta/:courseId/:questionId',
        component: ChatTchAnswerComponent
      },
      {
        path: 'cursos/list/:userId',
        component: CoursesComponent,
      },
      {
        path: 'cursos/anuncios/:idCurso',
        component: AdsCursoComponent,
      },
      {
        path: 'cursos/anuncios/estudiante/:idCurso/:stdId',
        component: AdsCursoComponent,
        pathMatch: 'full',
      },
      {
        path: 'cursos/anuncios/crear/:idCurso',
        component: CreateAdsCursoComponent,
        pathMatch: 'full',
      },
      {
        path: 'cursos/anuncios/editar/:idCurso/:idAnuncio',
        component: EditAdsCursoComponent,
      },
      {
        path: 'carreras/anuncios/:careerId',
        component: AdsCursoComponent,
      },
      {
        path: 'carreras/anuncios/estudiante/:careerId/:stdId',
        component: AdsCursoComponent,
        pathMatch: 'full',
      },
      {
        path: 'carreras/anuncios/crear/:careerId',
        component: CreateAdsCursoComponent,
        pathMatch: 'full',
      },
      {
        path: 'carreras/anuncios/editar/:careerId/:idAnuncio',
        component: EditAdsCursoComponent,
      },
      {
        path: 'cursos/lecciones/create',
        component: LessonCreateComponent,
      },
      {
        path: 'cursos/:cid/lecciones/config/:lid/:contentId',
        component: LessonConfigComponent,
      },
      {
        path: 'cursos/:cid/lecciones/content-list/:lid',
        component: LessonContentListComponent,
      },
      {
        path: 'cursos/lecciones/:id',
        component: LeccionesComponent,
      },
      {
        path: 'cursos/lecciones-carrera/:careerId/:stdId/:id',
        component: LeccionesComponent,
      },
      {
        path: 'cursos/ejercicios/:courseId',
        component: ExercisesListComponent,
      },
      {
        path: 'cursos/ejercicios/:careerId/:career',
        component: ExercisesListComponent,
      },
      {
        path: 'cursos/ejercicios/crear/:courseId',
        component: ExercisesCreateComponent,
      },
      {
        path: 'cursos/ejercicios/revisar/:courseId/:exerciseId',
        component: ExercisesRevComponent,
      },
      {
        path: 'cursos/ejercicios-carrera/revisar/:careerId/:exerciseId',
        component: ExercisesRevComponent,
      },
      {
        path: 'cursos/ejercicios/revisar/detalle/:courseId/:exerciseId/:testId/:stdId',
        component: ExercisesRevDetailComponent,
      },
      {
        path: 'cursos/ejercicios-carrera/revisar/detalle/:careerId/:exerciseId/:testId/:stdId',
        component: ExercisesRevDetailComponent,
      },
      {
        path: 'cursos/ejercicios/editar/:courseId/:exerciseId',
        component: ExercisesCreateComponent,
      },
      {
        path: 'cursos/ejercicios/:courseId/questions/:exerciseId',
        component: QuestionsListComponent,
      },
      {
        path: 'cursos/ejercicios-carrera/:careerId/questions/:exerciseId',
        component: QuestionsListComponent,
      },
      {
        path: 'cursos/ejercicios/:courseId/preguntas/add/:exerciseId',
        component: QuestionCreateComponent,
      },
      {
        path: 'cursos/ejercicios-carrera/:careerId/preguntas/add/:exerciseId',
        component: QuestionCreateComponent,
      },
      {
        path: 'cursos/ejercicios/:courseId/preguntas/edit/:exerciseId/:questionPosition/:questionType/:answerTrue',
        component: QuestionCreateComponent,
      },
      {
        path: 'cursos/ejercicios-carrera/:careerId/preguntas/edit/:exerciseId/:questionPosition/:questionType/:answerTrue',
        component: QuestionCreateComponent,
      },
      {
        path: 'cursos/evaluaciones/:courseId',
        component: EvaluationsHomeComponent,
      },
      {
        path: 'cursos/evaluaciones-carrera/:careerId/:courseId/:stdId',
        component: EvaluationsHomeComponent,
      },
      {
        path: 'cursos/evaluaciones-carrera-std/:careerId/:courseId/:stdId',
        component: StdEvaluationComponent,
      },
      {
        path: 'cursos/evaluaciones/estudiante/:courseId/:stdId',
        component: StdEvaluationComponent,
      },
      {
        path: 'cursos/foros/revisar/:courseId',
        component: ForumRevComponent,
      },
      {
        path: 'cursos/foros/revisar/respuestas/:courseId/:lessonId/:forumId',
        component: ForumUsersAnswersComponent,
      },
      {
        path: 'cursos/foros/revisar/respuesta-estudiante/:courseId/:lessonId/:forumId/:stdId/:userForumId',
        component: ForumRevDetailComponent,
      },
      {
        path: 'cursos/glosario/:courseId',
        component: GlossaryListComponent,
      },
      {
        path: 'cursos/glosario/:courseId/:stdId',
        component: GlossaryListComponent,
      },
      {
        path: 'cursos/glosario/:courseId/create',
        component: GlossaryCreateComponent,
      },
      {
        path: 'cursos/video-meet/:courseId',
        component: VideoConferenceListComponent,
      },
      {
        path: 'cursos/video-meet/:courseId/:stdId',
        component: VideoConferenceListComponent,
      },
      {
        path: 'categorias',
        component: CategoriesComponent,
      },
      {
        path: 'categorias/create',
        component: CategoryCreateComponent,
      },
      {
        path: 'categorias/edit/:id',
        component: CategoryCreateComponent,
      },
      {
        path: 'ads/ads-list',
        component: AdsListComponent,
      },
      {
        path: 'ads/ads-create',
        component: AdsCreateComponent,
      },
      {
        path: 'ads/ads-edit/:id',
        component: AdsEditComponent,
      },
      {
        path: 'mis-cursos/:stdId',
        component: CourseRegistrationComponent,
      },
      {
        path: 'mis-cursos-carrera/:stdId/:careerId',
        component: CourseRegistrationComponent,
      },
      {
        path: 'mis-cursos-carrera/:stdId/:careerId/:std',
        component: CourseRegistrationComponent,
      },
      {
        path: 'mis-cursos-lecciones-carrera/:stdId/:careerId',
        component: CarrerasLeccionesComponent,
      },
      {
        path: 'mis-cursos-lecciones-carrera/:stdId/:careerId/:std',
        component: CarrerasLeccionesComponent,
      },
      {
        path: 'mis-cursos/lecciones/:courseId/:stdId',
        component: LessonsComponent,
      },
      {
        path: 'mis-cursos/lecciones-carrera/:careerId/:courseId/:stdId',
        component: LessonsComponent,
      },
      {
        path: 'mis-carreras/:stdId',
        component: MycareersComponent,
      },
      {
        path: 'mis-carreras/cursos/:careerId/:stdId',
        component: CareerCoursesComponent,
      },
      {
        path: 'evaluacion/:idLesson/:stdId/:careerId',
        component: EvaluationHomeComponent
      },
      {
        path: 'evaluacion/:idLesson/:stdId/:careerId/:std',
        component: EvaluationHomeComponent
      },
      {
        path: 'final-evaluacion/:careerId/:stdId/:exercId/:testId',
        component: EvaluationFinishComponent
      },
      {
        path: 'final-evaluacion/:careerId/:stdId/:exercId/:testId/:consulta',
        component: EvaluationFinishComponent
      },
      {
        path: 'mis-certificados/:stdId',
        component: StdCerticatesComponent,
      },
      {
        path: 'crear-certificado',
        component: AdmCreateCertificateComponent,
      },
      {
        path: 'editar-certificado/:certificado',
        component: AdmEditCertificateComponent,
      },
      {
        path: 'disenar-certificado',
        component: AdmDesignCertificateComponent,
      },
      {
        path: 'editar-diseno/:designId',
        component: AdmDesignCertificateComponent
      },
      {
        path: 'disenos-certificados',
        component: AdmDesignListComponent,
      },
      {
        path: 'certificados',
        component: AdmListCertificatesComponent,
      },
      {
        path: 'add-student/:idCurso',
        component: AddStudentComponent,
      },
      {
        path: 'cursos/registration/:idCurso',
        component: CourseHomeComponentRegistration,
      },
      {
        path: 'documents/:idCurso',
        component: DocumentsComponent,
      },
      {
        path: 'documents/:idCurso/:idEstudiante',
        component: DocumentsComponent,
      },
      {
        path: 'carreras',
        component: CarrerasComponent,
      },
      {
        path: 'carreras/create',
        component: CreateCarrerasComponent,
      },
      {
        path: 'carreras/edit/:idCarreras',
        component: EditCarrerasComponent,
      },
      {
        path: 'carreras/add-estudiantes/:idCarreras',
        component: AddEstudiantesComponent,
      },
      {
        path: 'carreras/add-curso/:idCarreras',
        component: AddCursoComponent,
      },
      {
        path: 'carreras/detail/:idCarreras',
        component: CarrerasDetailComponent,
      },
      {
        path: 'carreras/catalogo/:idUser',
        component: CareersComponent,
      },
      {
        path: 'carreras/detail/dash/:idCarreras/:idUser',
        component: CarrerasDetailComponent,
      },
      {
        path: 'carreras/detail/:idCarreras/home/:home',
        component: CarrerasDetailComponent,
      },
      {
        path: 'carreras/index/:careerId/:type',
        component: CarrerasIndexComponent,
      },
      {
        path: 'consulta-certificados',
        component: CertValidationComponent
      },
      {
        path: 'cupones',
        component: CuponsComponent
      },
      {
        path: 'crear-cupon',
        component: CouponsCreateComponent
      },
      {
        path: 'editar-cupon/:couponId',
        component: CouponsCreateComponent
      },
      {
        path: 'respuesta-pago',
        component: PayuConfirmationComponent
      },
      {
        path: 'adm-pagos',
        component: AdmPaymentsComponent
      },
      {
        path: 'mis-pagos/:stdId',
        component: StdPaymentsComponent
      }
    ],
  },
  {
    path: 'course-view',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('../course-view/course-view.module').then(
        (d) => d.CourseViewModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
