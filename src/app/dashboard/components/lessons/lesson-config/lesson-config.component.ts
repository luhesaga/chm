import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject, Subject } from 'rxjs';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';

@Component({
  selector: 'app-lesson-config',
  templateUrl: './lesson-config.component.html',
  styleUrls: ['./lesson-config.component.scss']
})
export class LessonConfigComponent implements OnInit, AfterViewInit {

  courseId: string;
  lessonId: string;

  description;
  id;
  titulo;

  private editorSubject: Subject<any> = new AsyncSubject();

  form: FormGroup;

  lessonReceived;
  lesson;
  lessonName;

  @ViewChild('tabGroup') tabGroup;


  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private lessonService: LessonsService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.cid;
    this.lessonId = this.activatedRoute.snapshot.params.lid;
    console.log(`id curso: ${this.courseId}, id lección: ${this.lessonId}`);
    this.lessonReceived = this.lessonService.lessonDetail(this.courseId, this.lessonId)
      .valueChanges()
      .subscribe((lesson: any) => {
        console.log(lesson);
        this.lesson = lesson;
        this.lessonName = lesson.nombre;
        console.log(lesson);
      })
    this.buildForm()
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log('afterViewInit => ', this.tabGroup.selectedIndex);
    //this.tabGroup.selectedIndex = 2;
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required,],
      contenido: [''],
      archivo: [''],
    })
  }

  get tituloField() {
    return this.form.get('titulo');
  }

  get contenidoField() {
    return this.form.get('contenido');
  }

  get archivoField() {
    return this.form.get('archivo');
  }

  cancel() {
    this.route.navigate([`cursos/lecciones/${this.courseId}`]);
  }

  onSubmit(event: Event){
    //console.log(this.form.value);
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //this.form.disable();
      console.log(this.form.value)
      this.lessonService.addLessonContent(
        this.form.value,
        this.courseId,
        this.lessonId
      ).then(() => console.log('listo'))
      .catch((error) => console.log(error));
      // if (!this.id) {
      //   //this.saveCourse()
      // } else {
      //   //this.editCourse()
      // }
    }
  }

  changeContentType() {
    this.tabGroup.selectedIndex = 3
  }


}
