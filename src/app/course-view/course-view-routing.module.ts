import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { EvaluationHomeComponent } from './components/evaluation/evaluation-home/evaluation-home.component';
import { ForoComponent } from './components/foro/foro.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { ReplyForoComponent } from './components/reply-foro/reply-foro.component';
import { EvaluationViewComponent } from './components/evaluation/evaluation-view/evaluation-view.component';
import { EvaluationFinishComponent } from './components/evaluation/evaluation-finish/evaluation-finish.component';
import { LoginGuard } from '../home/components/auth/login/guards/login.guard';



const routes: Routes = [
  {
    path: ':CId/:LId/:SId',
    canActivate:[LoginGuard],
    component: NavigationComponent,
    children:
      [
        {
          path: 'reply-foro/:idCurso/:idLesson/:idContent/:tipo/:idReplayForo',
          component: ReplyForoComponent
        },
        {
          path: 'reply-foro/:idCurso/:idLesson/:idContent/:tipo',
          component: ReplyForoComponent
        },
        {
          path: 'pdf/:idCurso/:idLesson/:idContent/:stdId',
          component: PdfComponent
        },
        {
          path: 'contenido/:idCurso/:idLesson/:idContent/:stdId',
          component: ContenidoComponent
        },
        {
          path: 'foro/:idCurso/:idLesson/:idContent/:stdId',
          component: ForoComponent
        },
        {
          path: 'evaluacion/:idCurso/:idLesson/:idContent/:stdId',
          component: EvaluationHomeComponent
        },

      ]
  },
  {
    path: 'ver-evaluacion/:idCurso/:idLesson/:idContent/:exercId/:stdId',
    component: EvaluationViewComponent
  },
  {
    path: 'final-evaluacion/:idCurso/:idLesson/:idContent/:exercId/:stdId',
    component: EvaluationFinishComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseViewRoutingModule { }
