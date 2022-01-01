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

  courseId: string;
  careerId: string;
  careerView = false;
  exerciseId: string;

  exercise;
  exerciseReceived;

  questions = [];

  constructor(
    private activatedRoute: ActivatedRoute,
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
          this.questions = ex.preguntas;
          this.dataSource.data = this.questions;
        } else {
          this.dataSource.data = [];
        }
      });
  }

  getCareerExerciseDetail(): void {
    this.exercise = this.careerService
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
    // console.log(t.content.firstChild.textContent);
    return t.content.firstChild.textContent;
  }
}
