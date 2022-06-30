import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from '../../../../../core/services/exercises/exercises.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CarrerasService } from '../../../../../core/services/carreras/carreras.service';
import { CourseService } from '../../../../../core/services/courses/course.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
})
export class QuestionsListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['posicion', 'nombre', 'tipo', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  panelOpenState = false;

  courseId: string;
  careerId: string;
  careerView = false;
  exerciseId: string;

  exercise;
  exerciseReceived;

  existingQuestions: any;
  showExistingQ = false;
  questionsToAdd = [];

  questions = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private exercService: ExercisesService,
    private careerService: CarrerasService,
    private router: Router
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
  }

  ngOnInit(): void {
    if (!this.careerView) {
      this.getCourseExerciseDetail();
    } else {
      this.getCareerExerciseDetail();
    }
    this.existingQuestions = this.getExistingQuestions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.exercise) {
      this.exercise.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourseExerciseDetail(): void {
    this.exercise = this.exercService
      .exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        if (ex) {
          this.exerciseReceived = ex;
          this.questions = ex.preguntas ? ex.preguntas : [];
          this.dataSource.data = this.questions;
        } else {
          this.dataSource.data = [];
        }
      });
  }

  getCareerExerciseDetail(): void {
    const exercise = this.careerService
      .exerciseDetail(this.careerId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        if (ex) {
          this.exerciseReceived = ex;
          this.questions = ex.preguntas;
          this.dataSource.data = this.questions;
        } else {
          this.dataSource.data = [];
        }
        exercise.unsubscribe();
      });
  }

  createOrEditQuestion(exerc): void {
    if (!exerc) {
      if (!this.careerView) {
        this.router.navigate([
          `cursos/ejercicios/${this.courseId}/preguntas/add/${this.exerciseId}`,
        ]);
      } else {
        this.router.navigate([
          `cursos/ejercicios-carrera/${this.careerId}/preguntas/add/${this.exerciseId}`,
        ]);
      }
    } else {
      let answerTrue;
      if (exerc.type === 1 || exerc.type === 2) {
        answerTrue = exerc.answers.filter((x) => x.respuesta === true)[0].value;
      } else {
        answerTrue = 0;
      }
      if (!this.careerView) {
        this.router.navigate([
          `cursos/ejercicios/${this.courseId}/preguntas/edit/${this.exerciseId}/${exerc.position}/${exerc.type}/${answerTrue}`,
        ]);
      } else {
        this.router.navigate([
          `cursos/ejercicios-carrera/${this.careerId}/preguntas/edit/${this.exerciseId}/${exerc.position}/${exerc.type}/${answerTrue}`,
        ]);
      }
    }
  }

  deleteQuestion(data): void {
    this.deleteMessage()
      .then((result) => {
        if (result.value) {
          // console.log(data);
          const pos = data.position;
          const i = 1;
          // console.log(this.questions);
          this.exerciseReceived.preguntas.forEach((p) => {
            if (p.position > pos) {
              p.position -= 1;
            }
          });
          this.questions.splice(pos - 1, 1);
          if (!this.careerView) {
            this.deleteCourseQuestion();
          } else {
            this.deleteCareerQuestion();
          }
        }
      })
      .catch((error) => console.log(error));
  }

  deleteCourseQuestion(): void {
    this.exercService
      .addQuestion(this.courseId, this.exerciseId, this.questions)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'pregunta eliminada exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.router.navigate([
          `cursos/ejercicios/${this.courseId}/questions/${this.exerciseId}`,
        ]);
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

  deleteCareerQuestion(): void {
    this.careerService
      .addQuestion(this.careerId, this.exerciseId, this.questions)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'pregunta eliminada exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.router.navigate([
          `cursos/ejercicios-carrera/${this.careerId}/questions/${this.exerciseId}`,
        ]);
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

  deleteMessage(): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara esta pregunta permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    });
  }

  createOrEditExercise(): void {
    this.router.navigate([`cursos/ejercicios/crear/${this.courseId}`]);
  }

  goBack(): void {
    if (!this.careerView) {
      this.router.navigate([`cursos/ejercicios/${this.courseId}`]);
    } else {
      this.router.navigate([`cursos/ejercicios/${this.careerId}/${'career'}`]);
    }
  }

  goToDetail(id): void {
    this.router.navigate([`/cursos/detail/view${id}`]);
  }

  goToQuestionList(id): void {
    this.router.navigate([
      `cursos/ejercicios/${this.courseId}/questions/${id}`,
    ]);
  }

  questionType(type: number): string {
    let questionType;
    switch (type) {
      case 1:
        questionType = 'Selección única';
        break;
      case 2:
        questionType = ' Selección multiple';
        break;
      case 3:
        questionType = 'Rellenar blancos';
        break;
      case 4:
        questionType = 'Relacionar';
        break;
      case 5:
        questionType = 'Respuesta libre';
        break;
      case 6:
        questionType = 'Tarea';
        break;
      default:
        questionType = 'No definido';
        break;
    }

    return questionType;
  }

  parseHTML(html): string {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content.firstChild.textContent;
  }

  // obtener preguntas de cursos

  getExistingQuestions(): any {
    const preguntas = [];
    this.getCourseQuestions(preguntas);
    // console.log(preguntas);
    return preguntas;
  }

  getCourseQuestions(preguntas): void {
    const courses = this.courseService
      .listCourses()
      .valueChanges()
      .subscribe((c) => {
        c.forEach((curso, index) => {
          preguntas.push({
            curso: 'curso ' + curso.nombre,
            evaluation: [],
          });
          this.getQuestions(curso, index, preguntas);
        });
        this.obtenerListaDeCarreras(preguntas);
        courses.unsubscribe();
      });
  }

  getQuestions(course, i, preguntas): void {
    const exerc = this.exercService
      .listExercisesByName(course.id)
      .valueChanges()
      .subscribe((exercises: any) => {
        // console.log(exercises);
        if (exercises.length > 0) {
          exercises.forEach((ex, index) => {
            if (ex.preguntas) {
              preguntas[i].evaluation.push({
                evaluation: ex.nombre,
                q1: [],
                q2: [],
                q3: [],
                q4: [],
                q5: [],
                q6: [],
              });
              ex.preguntas.forEach((q) => {
                switch (q.type) {
                  case 1:
                    preguntas[i].evaluation[index].q1.push(q);
                    break;
                  case 2:
                    preguntas[i].evaluation[index].q2.push(q);
                    break;
                  case 3:
                    preguntas[i].evaluation[index].q3.push(q);
                    break;
                  case 4:
                    preguntas[i].evaluation[index].q4.push(q);
                    break;
                  case 5:
                    preguntas[i].evaluation[index].q5.push(q);
                    break;
                  case 6:
                    preguntas[i].evaluation[index].q6.push(q);
                    break;
                }
              });
            }
          });
        }
        exerc.unsubscribe();
      });
  }

  obtenerListaDeCarreras(preguntas: any): void {
    let pos = preguntas.length;
    const listaCarreras = this.careerService.obtenerCarreras()
      .valueChanges()
      .subscribe(carreras => {
        carreras.forEach(carrera => {
          // console.log(carrera);
          preguntas.push({
            curso: 'carrera ' + carrera.nombre,
            evaluation: [],
          });
          this.obtenerCursosCarrera(carrera, preguntas, pos);
          pos += 1;
        });
        // console.log(preguntas);
        listaCarreras.unsubscribe();
      });
  }

  obtenerCursosCarrera(carrera: any, preguntas: any, pos: number): void {
    let posE = 0;
    const listaCursos = this.careerService.getCareerCourses(carrera.id)
      .valueChanges()
      .subscribe(cursos => {
        cursos.forEach((curso) => {
          if (curso.tipo === 'ejercicio') {
            if (curso.preguntas) {
              preguntas[pos].evaluation.push({
                evaluation: curso.nombre,
                q1: [],
                q2: [],
                q3: [],
                q4: [],
                q5: [],
                q6: [],
              });
              curso.preguntas.forEach((q) => {
                switch (q.type) {
                  case 1:
                    preguntas[pos].evaluation[posE].q1.push(q);
                    break;
                  case 2:
                    preguntas[pos].evaluation[posE].q2.push(q);
                    break;
                  case 3:
                    preguntas[pos].evaluation[posE].q3.push(q);
                    break;
                  case 4:
                    preguntas[pos].evaluation[posE].q4.push(q);
                    break;
                  case 5:
                    preguntas[pos].evaluation[posE].q5.push(q);
                    break;
                  case 6:
                    preguntas[pos].evaluation[posE].q6.push(q);
                    break;
                }
              });
            }
            posE += 1;
          }
        });
        listaCursos.unsubscribe();
      });
  }

  // Agregar preguntas existentes

  selectionChange(event: MatRadioChange): void {
    this.panelOpenState = false;
  }

  addExistingQuestion(): void {
    if (this.showExistingQ) {
      this.showExistingQ = false;
    } else {
      this.showExistingQ = true;
    }
  }

  saveQuestion(): void {

    if (this.questionsToAdd.length > 0) {
      let pos: number;
      // validar si hay preguntas y posicion a asignar
      if (!this.questions) {
        this.questions = [];
        pos = 1;
      } else {
        pos = this.questions.length + 1;
      }

      this.questionsToAdd.forEach(q => {
        this.questions.push({
          question: q.question,
          type: q.type,
          answers: q.answers,
          position: pos,
          tarea: q.tarea ? q.tarea : '',
        });
        pos += 1;
      });

      this.dataSource.data = this.questions;

      if (!this.careerView) {
        this.saveCourseQuestion();
      } else {
        // console.log(this.questions);
        this.saveCareerQuestion();
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: 'Debe seleccionar al menos una pregunta.',
        confirmButtonText: 'cerrar',
      });
    }

  }

  saveCourseQuestion(): void {
    this.exercService
      .addQuestion(this.courseId, this.exerciseId, this.questions)
      .then(() => {
        this.successMessage('create');
        this.showExistingQ = false;
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  saveCareerQuestion(): void {
    this.careerService
      .addQuestion(this.careerId, this.exerciseId, this.questions)
      .then(() => {
        this.successMessage('create');
        this.showExistingQ = false;
      })
      .catch((error) => {
        this.errorMessage(error);
      });
  }

  successMessage(action: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Exito!',
      text: `pregunta ${
        action === 'create' ? 'agregada' : 'actualizada'
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

  questionSelected(event): void {
    if (event.checked) {
      this.questionsToAdd.push(event.source.value);
    } else {
      const pregunta = event.source.value.question;
      this.questionsToAdd = this.quitarPreguntaDelArray(pregunta);
    }
  }

  quitarPreguntaDelArray(pregunta: any): any {
    return this.questionsToAdd
      .filter(x => x.question !== pregunta);
  }
}
