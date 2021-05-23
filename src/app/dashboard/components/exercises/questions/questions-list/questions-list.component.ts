import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { lutimesSync } from 'fs';
import { ExercisesService } from '../../../../../core/services/exercises/exercises.service';

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
    console.log(`Id curso: ${this.courseId}, Id Ejercicio: ${this.exerciseId}`);
   }

  ngOnInit(): void {
    this.exercise = this.exercService.exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe((ex: any) => {
        this.exerciseReceived = ex;
        this.questions = ex.preguntas;
        this.dataSource.data = this.questions;
        console.log(ex);
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
    if (!exerc) {
      this.router.navigate([`cursos/ejercicios/${this.courseId}/preguntas/add/${this.exerciseId}`]);
    } else {
      this.router.navigate([`cursos/ejercicios/${this.courseId}/preguntas/add/${this.exerciseId + 'edit' + exerc.position}`]);
    }
  }

  openDialog(data) {}

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
      default:
        questionType = 'No definido';
        break;
    }

    return questionType;
  }

  parseHTML(html) {
    let t = document.createElement('template');
    t.innerHTML = html;
    console.log(t.content.firstChild.textContent);
    return t.content.firstChild.textContent;
  }

}
