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
import { EditorModule } from '@tinymce/tinymce-angular';
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
import { VideoConferenceListComponent } from './components/video-conference/video-conference-list/video-conference-list.component';
import { VideoConferenceCreateComponent } from './components/video-conference/video-conference-create/video-conference-create.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AdsCursoComponent } from './components/cursos/ads-curso/ads-curso.component';
import { CreateAdsCursoComponent } from './components/cursos/ads-curso/create-ads-curso/create-ads-curso.component';
import { EditAdsCursoComponent } from './components/cursos/ads-curso/edit-ads-curso/edit-ads-curso.component';
import { ModalDocumentsComponent } from './components/documents/modal-documents/modal-documents.component';
import { ExercisesRevComponent } from './components/exercises/exercises-rev/exercises-rev/exercises-rev.component';
import { ExercisesRevDetailComponent } from './components/exercises/exercises-rev-detail/exercises-rev-detail/exercises-rev-detail.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { CreateCarrerasComponent } from './components/carreras/create-carreras/create-carreras.component';
import { ModalVistaAdsComponent } from './components/cursos/ads-curso/modal-vista-ads/modal-vista-ads.component';
import { ForumRevComponent } from './components/forum/forum-rev/forum-rev/forum-rev.component';
import { ForumUsersAnswersComponent } from './components/forum/forum-users-answers/forum-users-answers/forum-users-answers.component';
import { ForumRevDetailComponent } from './components/forum/forum-rev-detail/forum-rev-detail/forum-rev-detail.component';
import { EvaluationsHomeComponent } from './components/evaluations/evaluations-home/evaluations-home/evaluations-home.component';
import { EditCarrerasComponent } from './components/carreras/edit-carreras/edit-carreras.component';
import { AddEstudiantesComponent } from './components/carreras/add-estudiantes/add-estudiantes.component';
import { AddCursoComponent } from './components/carreras/add-curso/add-curso.component';
import { DescripcionCarreraComponent } from './components/carreras/descripcion-carrera/descripcion-carrera.component';
import { DescripcionEditComponent } from './components/carreras/descripcion-carrera/descripcion-edit/descripcion-edit.component';
import { CarrerasDetailComponent } from './components/carreras/carreras-detail/carreras-detail.component';
import { CatalogoCarrerasComponent } from './components/carreras/catalogo-carreras/catalogo-carreras.component';
import { StarRatingModule } from 'angular-star-rating';
import { MatricularEstudiantesCarreraComponent } from './components/carreras/add-estudiantes/matricular-estudiantes-carrera/matricular-estudiantes-carrera.component';
import { AgregarCursoComponent } from './components/carreras/add-curso/agregar-curso/agregar-curso.component';
import { CarrerasInfoComponent } from './components/carreras/catalogo-carreras/carreras-info/carreras-info.component';
import { MycareersComponent } from './components/mycareers/mycareers.component';
import { CareerCoursesComponent } from './components/mycareers/career-courses/career-courses.component';
import { StdEvaluationComponent } from './components/evaluations/std-evaluation/std-evaluation.component';
import { StdCerticatesComponent } from './components/certificates/std-certicates/std-certicates.component';
import { AdmListCertificatesComponent } from './components/certificates/adm-list-certificates/adm-list-certificates.component';
import { AdmEditCertificateComponent } from './components/certificates/adm-edit-certificate/adm-edit-certificate.component';
import { AdmCreateCertificateComponent } from './components/certificates/adm-create-certificate/adm-create-certificate.component';
import { CarrerasIndexComponent } from './components/carreras/carreras-index/carreras-index.component';
import { CarrerasLeccionesComponent } from './components/carreras/carreras-lecciones/carreras-lecciones.component';
import { CourseViewModule } from '../course-view/course-view.module';
import { AdmDesignCertificateComponent } from './components/certificates/adm-design-certificate/adm-design-certificate.component';
import { AdmDesignListComponent } from './components/certificates/adm-design-list/adm-design-list.component';
import { AdmDesignViewComponent } from './components/certificates/adm-design-view/adm-design-view.component';
import { CheckoutComponent } from './components/payu/checkout/checkout.component';
import { CuponsComponent } from './components/payu/cupons/cupons.component';
import { CouponsCreateComponent } from './components/payu/coupons-create/coupons-create.component';
import { PayuConfirmationComponent } from './components/payu/payu-confirmation/payu-confirmation.component';
import { AdmPaymentsComponent } from './components/payu/adm-payments/adm-payments.component';
import { StdPaymentsComponent } from './components/payu/std-payments/std-payments.component';
import { UserInfoComponent } from './components/users/user-info/user-info.component';

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
    VideoConferenceListComponent,
    VideoConferenceCreateComponent,
    DocumentsComponent,
    AdsCursoComponent,
    CreateAdsCursoComponent,
    EditAdsCursoComponent,
    ModalDocumentsComponent,
    ExercisesRevComponent,
    ExercisesRevDetailComponent,
    CarrerasComponent,
    CreateCarrerasComponent,
    ModalVistaAdsComponent,
    ForumRevComponent,
    ForumUsersAnswersComponent,
    ForumRevDetailComponent,
    EvaluationsHomeComponent,
    EditCarrerasComponent,
    AddEstudiantesComponent,
    AddCursoComponent,
    DescripcionCarreraComponent,
    DescripcionEditComponent,
    CarrerasDetailComponent,
    CatalogoCarrerasComponent,
    MatricularEstudiantesCarreraComponent,
    AgregarCursoComponent,
    CarrerasInfoComponent,
    MycareersComponent,
    CareerCoursesComponent,
    StdEvaluationComponent,
    StdCerticatesComponent,
    AdmListCertificatesComponent,
    AdmEditCertificateComponent,
    AdmCreateCertificateComponent,
    CarrerasIndexComponent,
    CarrerasLeccionesComponent,
    AdmDesignCertificateComponent,
    AdmDesignListComponent,
    AdmDesignViewComponent,
    CheckoutComponent,
    CuponsComponent,
    CouponsCreateComponent,
    PayuConfirmationComponent,
    AdmPaymentsComponent,
    StdPaymentsComponent,
    UserInfoComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    EditorModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule,
    CourseViewModule,
    MatCarouselModule.forRoot(),
  ],
  exports: [CarouselComponent],
})
export class DashboardModule {}
