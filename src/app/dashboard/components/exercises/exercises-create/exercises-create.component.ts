import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AsyncSubject, Subject } from 'rxjs';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { ExercisesListComponent } from '../exercises-list/exercises-list.component';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
@Component({
  selector: 'app-exercises-create',
  templateUrl: './exercises-create.component.html',
  styleUrls: ['./exercises-create.component.scss'],
})
export class ExercisesCreateComponent implements OnInit {
  private editorSubject: Subject<any> = new AsyncSubject();

  form: FormGroup;

  edit = false;
  exerciseName: string;
  exerciseId: string;
  courseId: string;
  careerId: string;

  feedback = '1';
  mostrarResultado = '2';
  seleccion = '1';
  // barajar = '2';
  intentos = 1;
  duracion = 30;
  porcentaje = 60;
  questions = 0;
  textEndExercise: string;
  careerExercisePosition = 0;

  constructor(
    public dialog: MatDialogRef<ExercisesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    private formBuilder: FormBuilder,
    private exercise: ExercisesService,
    private careerService: CarrerasService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    if (this.data.content.action === 'edit') {
      this.exerciseId = this.data.content.id;
      this.nameField.setValue(this.data.content.nombre);
      this.feedback = this.data.content.retroalimentacion
        ? this.data.content.retroalimentacion.toString()
        : this.feedback;
      this.mostrarResultado = this.data.content.mostrarResultados
        ? this.data.content.mostrarResultados.toString()
        : this.mostrarResultado;
      this.seleccion = this.data.content.seleccion
        ? this.data.content.seleccion.toString()
        : this.seleccion;
      this.questions = this.data.content.questionsNumber
        ? this.data.content.questionsNumber
        : this.questions;
      this.intentos = this.data.content.intentos
        ? this.data.content.intentos
        : this.intentos;
      this.duracion = this.data.content.duracion
        ? this.data.content.duracion
        : this.duracion;
      this.porcentaje = this.data.content.porcentaje
        ? this.data.content.porcentaje
        : this.porcentaje;
      this.textEndExercise = this.data.content.textoFinal
        ? this.data.content.textoFinal
        : this.textEndExercise;
      this.edit = true;
    }
    if (this.data.content.courseId) {
      this.courseId = this.data.content.courseId;
    } else {
      this.careerId = this.data.content.careerId;
      this.getCareerCourses();
    }

    console.log(this.careerId);
  }

  handleEditorInit(e): void {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      feedback: ['', Validators.required],
      showResults: ['', Validators.required],
      questionSelect: ['', Validators.required],
      // mixAnswers: ['', Validators.required],
      maxTries: ['', Validators.required],
      duration: ['', Validators.required],
      questionsNumber: ['', Validators.required],
      percentage: ['', Validators.required],
      textEnd: [''],
    });
  }

  get nameField(): AbstractControl {
    return this.form.get('name');
  }

  get feedbackField(): AbstractControl {
    return this.form.get('feedback');
  }

  get showResults(): AbstractControl {
    return this.form.get('showResults');
  }

  get questionSelect(): AbstractControl {
    return this.form.get('questionSelect');
  }

  get questionsNumber(): AbstractControl {
    return this.form.get('questionsNumber');
  }

  get maxTries(): AbstractControl {
    return this.form.get('maxTries');
  }

  get duration(): AbstractControl {
    return this.form.get('duration');
  }

  get percentage(): AbstractControl {
    return this.form.get('percentage');
  }

  get textEndField(): AbstractControl {
    return this.form.get('textEnd');
  }

  getCareerCourses(): void {
    const courses = this.careerService
      .getCareerCourses(this.careerId)
      .valueChanges()
      .subscribe((c) => {
        if (c.length > 0) {
          this.careerExercisePosition = c.length;
        }
        console.log(this.careerExercisePosition);
        courses.unsubscribe();
      });
  }

  saveOrEditExercise(event: Event): void {
    event.preventDefault();
    console.log(this.form.value);
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

  saveExercise(): void {
    this.form.value.fecha = new Date(Date.now()).toLocaleDateString();
    if (this.courseId) {
      this.saveCourseExercise();
    } else {
      this.form.value.posicion = this.careerExercisePosition + 1;
      this.saveCareerExercise();
    }
  }

  saveCourseExercise(): void {
    this.exercise
      .createExercise(this.form.value, this.courseId)
      .then(() => {
        this.successMessage('create');
        this.dialog.close();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  saveCareerExercise(): void {
    this.careerService
      .createExercise(this.form.value, this.careerId)
      .then(() => {
        this.successMessage('create');
        this.dialog.close();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  editExercise(): void {
    this.form.value.fecha = new Date(Date.now()).toLocaleDateString();
    if (this.courseId) {
      this.editCourseExercise();
    } else {
      this.editCareerExercise();
    }
  }

  editCourseExercise(): void {
    this.exercise
      .editExercise(this.form.value, this.courseId, this.exerciseId)
      .then(() => {
        this.successMessage('edit');
        this.dialog.close();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  editCareerExercise(): void {
    this.careerService
      .editExercise(this.form.value, this.careerId, this.exerciseId)
      .then(() => {
        this.successMessage('edit');
        this.dialog.close();
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  successMessage(accion: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Exito!',
      text: `Ejercicio ${
        accion === 'edit' ? 'actualizado' : 'creado'
      } exitosamente`,
      confirmButtonText: 'cerrar',
    });
  }

  errorMessage(error: string): void {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Ocurrió un error' + error,
      confirmButtonText: 'cerrar',
    });
  }
}
