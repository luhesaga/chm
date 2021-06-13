import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { ForoComponent } from './components/foro/foro.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { ReplyForoComponent } from './components/reply-foro/reply-foro.component';



const routes: Routes = [{
  path: ':idCurso/:idLesson',
  component:NavigationComponent,
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
      path:'pdf/:idCurso/:idLesson/:idContent',
      component: PdfComponent
    },
    {
      path: 'contenido/:idCurso/:idLesson/:idContent',
      component:ContenidoComponent
    },
    {
      path: 'foro/:idCurso/:idLesson/:idContent',
      component:ForoComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseViewRoutingModule { }
