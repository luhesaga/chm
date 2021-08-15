import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeccionesComponent } from '../lecciones/lecciones.component';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lesson-create',
  templateUrl: './lesson-create.component.html',
  styleUrls: ['./lesson-create.component.scss']
})
export class LessonCreateComponent implements OnInit {

  courseId: string;
  course;
  form: FormGroup;

  edit = false;
  lessonName;
  lessonId;
  cantlecciones: number;

  constructor(
    public dialog: MatDialogRef<LeccionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    private formBuilder: FormBuilder,
    private lessonService: LessonsService
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    if (this.data.message === 'Editar leccion') {
      // console.log(this.data.content.lessonName);
      this.lessonId = this.data.content.lessonId;
      this.lessonName = this.data.content.lessonName;
      this.edit = true;
    }

    this.cantlecciones = this.data.content.cantLecciones;
    this.courseId = this.data.content.courseId;
    // console.log(this.data.content);
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
      if (!this.edit) {
        this.saveLesson();
      } else {
        this.editLesson();
      }
    }else
    {
      this.mensajeError('Debe tener titulo la lección');
    }
  }

  mensajeError(mensaje:string)
  {
    Swal.fire({
      icon:'error',
      title: mensaje,
      confirmButtonText: 'Cerrar'
    });
  }

  editLesson() {
    const cId = this.courseId;
    const lId = this.lessonId;
    const lName = this.lessonName;
    this.lessonService.editLessonName(cId, lId, lName)
    .then(() => {
			Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'Lección actualizada exitosamente',
				confirmButtonText: 'cerrar',
			});
			this.dialog.close();
		})
		.catch((error) => {
			Swal.fire({
				icon: 'error',
				title: 'error',
				text: 'Ocurrió un error' + error,
				confirmButtonText: 'cerrar',
      });
		});

  }

  saveLesson() {
    this.form.value.id = this.courseId;
    this.form.value.position = this.cantlecciones + 1;
    console.log(this.form.value);
    this.lessonService.createLesson(this.form.value)
    .then(() => {
			Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'Lección creada exitosamente',
				confirmButtonText: 'cerrar',
			});
			this.dialog.close();
		})
		.catch((error) => {
			Swal.fire({
				icon: 'error',
				title: 'error',
				text: 'Ocurrió un error' + error,
				confirmButtonText: 'cerrar',
      });
		});
  }

}
