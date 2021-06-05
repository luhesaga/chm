import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ReplyForoComponent } from './components/reply-foro/reply-foro.component';



const routes: Routes = [{
  path: ':idCurso/:idLesson',
  component:NavigationComponent
},
{
  path: 'reply-foro/:idCurso/:idLesson',
  component: ReplyForoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseViewRoutingModule { }
