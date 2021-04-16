import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LeccionesComponent } from '../lecciones/lecciones.component';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';

@Component({
  selector: 'app-lesson-create',
  templateUrl: './lesson-create.component.html',
  styleUrls: ['./lesson-create.component.scss']
})
export class LessonCreateComponent implements OnInit, OnDestroy {

  courseId: string;
  course;
  form: FormGroup;

  id;
  name;
  position;
  cantlecciones: number;
  lecciones;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialogRef<LeccionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    private formBuilder: FormBuilder,
    private lessonService: LessonsService
  ) {
    this.buildForm()
   }

  ngOnInit(): void {
    this.course = this.data.content;
    console.log(this.course);
    this.lecciones = this.lessonService.listLessons(this.course.id).valueChanges()
      .subscribe(l => {
        this.cantlecciones = l.length;
      });
  }

  ngOnDestroy(): void {
    this.lecciones.unsubscribe();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required,],
      // position: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.max(999)]]
    })
  }

  get nameField() {
    return this.form.get('name');
  }

  // get positionField() {
  //   return this.form.get('position');
  // }

  saveOrEditLesson(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.id) {
        this.form.value.id = this.course.id;
        this.form.value.position = this.cantlecciones + 1;
        console.log(this.form.value);
        this.lessonService.createLesson(this.form.value)
            .then(() => {
              this.dialog.close();
            })
            .catch((error) => {
              console.error(error);
            });
        
        
      } else {
        console.log('hola');
      }
    }
  }

  cancel() {
    this.route.navigate([`cursos/lecciones/${this.courseId}`]);
  }

}
