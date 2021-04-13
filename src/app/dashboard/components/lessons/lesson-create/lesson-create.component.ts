import { Component, Inject, OnInit } from '@angular/core';
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
export class LessonCreateComponent implements OnInit {

  courseId: string;
  course;
  form: FormGroup;

  id;
  name;

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
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required,],
    })
  }
  
  get nameField() {
    return this.form.get('name');
  }

  saveOrEditLesson(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.id) {
        this.form.value.id = this.course.id;
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
