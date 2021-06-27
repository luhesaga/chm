import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncSubject, Subject } from 'rxjs';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { ExercisesListComponent } from '../exercises-list/exercises-list.component';
@Component({
  selector: 'app-exercises-create',
  templateUrl: './exercises-create.component.html',
  styleUrls: ['./exercises-create.component.scss']
})
export class ExercisesCreateComponent implements OnInit {

  private editorSubject: Subject<any> = new AsyncSubject();

  form: FormGroup;

  edit = false;
  exerciseName: string;
  exerciseId: string;
  courseId: string;

  feedback = '1';
  mostrarResultado = '2';
  seleccion = '1';
  barajar = '2';
  intentos = 1;
  duracion = 30;
  porcentaje = 60;
  textEndExercise: string;

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
    if (this.data.content.action === 'edit') {
      this.exerciseId = this.data.content.id;
      this.exerciseName = this.data.content.nombre;
      this.feedback = this.data.content.retroalimentacion.toString();
      this.mostrarResultado = this.data.content.mostrarResultados.toString();
      this.seleccion = this.data.content.seleccion.toString();
      this.barajar = this.data.content.barajar.toString();
      this.intentos = this.data.content.intentos;
      this.duracion = this.data.content.duracion;
      this.porcentaje = this.data.content.porcentaje;
      this.textEndExercise = this.data.content.textoFinal;
      this.edit = true;
    }
    this.courseId = this.data.content.courseId;
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required,],
      feedback: ['', Validators.required],
      showResults: ['', Validators.required],
      questionSelect: ['', Validators.required],
      mixAnswers: ['', Validators.required],
      maxTries: ['', Validators.required],
      duration: ['', Validators.required],
      percentage: ['', Validators.required],
      textEnd: ['']
    })
  }

  get nameField() {
    return this.form.get('name');
  }

  get feedbackField() {
    return this.form.get('feedback');
  }

  get showResults() {
    return this.form.get('showResults');
  }

  get questionSelect() {
    return this.form.get('questionSelect');
  }

  get mixAnswers() {
    return this.form.get('mixAnswers');
  }

  get maxTries() {
    return this.form.get('maxTries');
  }

  get duration() {
    return this.form.get('duration');
  }

  get percentage() {
    return this.form.get('percentage');
  }

  get textEndField() {
    return this.form.get('textEnd');
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
