import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from '../../../../../core/services/exercises/exercises.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['posicion', 'nombre', 'tipo', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId: string;
  exerciseId: string;

  exercise;
  exerciseReceived;

  questions = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private exercService: ExercisesService,
    private router: Router,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
    // console.log(`Id curso: ${this.courseId}, Id Ejercicio: ${this.exerciseId}`);
   }

  ngOnInit(): void {
    this.exercise = this.exercService.exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        //console.log(ex);
        if (ex) {
          this.exerciseReceived = ex;
          this.questions = ex.preguntas;
          this.dataSource.data = this.questions;
        } else {
          this.dataSource.data = [];
        }
        // console.log(this.questions);
      })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.exercise.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createOrEditQuestion(exerc) {
    console.log(exerc);
    if (!exerc) {
      this.router.navigate([`cursos/ejercicios/${this.courseId}/preguntas/add/${this.exerciseId}`]);
    } else {
      let answerTrue;
      if (exerc.type === 1 || exerc.type === 2) {
        answerTrue =  exerc.answers.filter(x => x.respuesta === true)[0].value;
      } else {
        answerTrue = 0;
      }
      this.router.navigate([`cursos/ejercicios/${this.courseId}/preguntas/edit/${this.exerciseId}/${exerc.position}/${exerc.type}/${answerTrue}`]);
    }
  }

  deleteQuestion(data) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara esta pregunta permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        // console.log(data);
        const pos = data.position;
        let i = 1;
        // console.log(this.questions);
        this.exerciseReceived.preguntas.forEach(p => {
          if (p.position > pos) {
            p.position -= 1;
          }
        });
        this.questions.splice(pos -1, 1);
        this.exercService.addQuestion(this.courseId, this.exerciseId, this.questions)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'pregunta eliminada exitosamente',
            confirmButtonText: 'cerrar',
        });
        this.router.navigate([`cursos/ejercicios/${this.courseId}/questions/${this.exerciseId}`]);
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
    })
    .catch(error => console.log(error));
  }

  createOrEditExercise() {
    this.router.navigate([`cursos/ejercicios/crear/${this.courseId}`]);
  }

  goBack() {
    this.router.navigate([`cursos/ejercicios/${this.courseId}`]);
  }

  goToDetail(id) {
    this.router.navigate([`/cursos/detail/view${id}`]);
  }

  goToQuestionList(id) {
    this.router.navigate([`cursos/ejercicios/${this.courseId}/questions/${id}`]);
  }

  questionType(type: number) {
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

  parseHTML(html) {
    let t = document.createElement('template');
    t.innerHTML = html;
    // console.log(t.content.firstChild.textContent);
    return t.content.firstChild.textContent;
  }

}
