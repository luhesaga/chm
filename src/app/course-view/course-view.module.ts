import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseViewRoutingModule } from './course-view-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditorModule } from "@tinymce/tinymce-angular";
import { ReplyForoComponent } from './components/reply-foro/reply-foro.component';
import { ForoComponent } from './components/foro/foro.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [NavigationComponent, ReplyForoComponent, ForoComponent, PdfComponent, ContenidoComponent],
  imports: [
    CommonModule,
    CourseViewRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgxExtendedPdfViewerModule,
    EditorModule,
    FormsModule
  ]
})
export class CourseViewModule { }
