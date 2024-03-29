import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseViewRoutingModule } from './course-view-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditorModule } from "@tinymce/tinymce-angular";
import { ReplyForoComponent } from './components/reply-foro/reply-foro.component';
import { ForoComponent } from './components/foro/foro.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { EvaluationHomeComponent } from './components/evaluation/evaluation-home/evaluation-home.component';
import { EvaluationViewComponent } from './components/evaluation/evaluation-view/evaluation-view.component';
import { EvaluationFinishComponent } from './components/evaluation/evaluation-finish/evaluation-finish.component';


@NgModule({
  declarations: [NavigationComponent, ReplyForoComponent, ForoComponent, PdfComponent, ContenidoComponent, EvaluationHomeComponent, EvaluationViewComponent, EvaluationFinishComponent],
  imports: [
    CommonModule,
    CourseViewRoutingModule,
    LayoutModule,
    MaterialModule,
    NgxExtendedPdfViewerModule,
    EditorModule,
    FormsModule
  ]
})
export class CourseViewModule { }
