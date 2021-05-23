import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { ExercisesListComponent } from '../exercises-list/exercises-list.component';
@Component({
  selector: 'app-exercises-create',
  templateUrl: './exercises-create.component.html',
  styleUrls: ['./exercises-create.component.scss']
})
export class ExercisesCreateComponent implements OnInit {

  form: FormGroup;
  edit = false;
  exerciseName: string;
  exerciseId: string;
  courseId: string;

  constructor(
    public dialog: MatDialogRef<ExercisesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    private formBuilder: FormBuilder,
    private exercise: ExercisesService,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    // console.log(this.data);
    if (this.data.content.action === 'edit') {
      this.exerciseId = this.data.content.exerciseId;
      this.exerciseName = this.data.content.name;
      this.edit = true;
      // console.log(this.exerciseId);
    }
    this.courseId = this.data.content.courseId;
    // console.log(this.courseId);
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required,],
    })
  }

  get nameField() {
    return this.form.get('name');
  }

  saveOrEditExercise(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.edit) {
        this.saveExercise();
      } else {
        this.editExercise();
      }
    }
  }
  saveExercise() {
    this.form.value.fecha = new Date(Date.now()).toLocaleDateString();
    // console.log(this.form.value.fecha);
    this.exercise.createExercise(this.form.value, this.courseId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Ejercicio creado exitosamente',
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

  editExercise() {
    this.form.value.fecha = new Date(Date.now()).toLocaleDateString();
    this.exercise.editExercise(this.form.value, this.courseId, this.exerciseId)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Exito!',
        text: 'Ejercicio actualizado exitosamente',
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
