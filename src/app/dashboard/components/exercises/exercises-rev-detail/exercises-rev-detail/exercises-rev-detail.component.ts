import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import { UsersService } from '../../../../../core/services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exercises-rev-detail',
  templateUrl: './exercises-rev-detail.component.html',
  styleUrls: ['./exercises-rev-detail.component.scss']
})
export class ExercisesRevDetailComponent implements OnInit {

  courseId;
  exerciseId;
  testId;
  stdId;
  exercise;
  user;
  answers;
  answersModified;
  fecha;
  result;

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O',
              'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private exerciseService: ExercisesService,
    private userService: UsersService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
    this.testId = this.activatedRoute.snapshot.params.testId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getExerciseDeatil();
    this.getUserData();
    this.getAnswers();
  }

  getExerciseDeatil() {
    let exerc = this.exerciseService.exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe(ex => {
        this.exercise = ex;
        exerc.unsubscribe();
      });
  }

  getUserData() {
    let userInfo = this.userService.detailUser(this.stdId)
      .valueChanges()
      .subscribe(u => {
        this.user = u;
        userInfo.unsubscribe();
      })
  }

  getAnswers() {
    let anwersReceived = this.exerciseService.detailTest(this.courseId, this.exerciseId, this.stdId, this.testId)
      .valueChanges()
      .subscribe(u => {
        this.answers = u.respuestas;
        this.answersModified = u.respuestas.slice()
        this.fecha = new Date(u.fecha).toLocaleDateString();
        this.getTotalResult(u.respuestas);
        anwersReceived.unsubscribe();
      });
  }

  getTotalResult(answers) {
    let nota: number = 0;
    answers.forEach(r => {
      nota += r.valor;
    });
    this.result = Math.ceil((nota / (answers.length * 100)) * 100);
  }

  saveCalification(item, i) {
    this.answersModified[i] = item;
    this.getTotalResult(this.answersModified);
  }

  saveRevition() {
    this.exerciseService.AnswersRevition(this.courseId, this.exerciseId, this.stdId, this.answersModified, this.testId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Calificación guardada exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.goBack();
      })
      .catch(err => console.log(err));
  }

  goBack() {
    this.router.navigate([`cursos/ejercicios/revisar/${this.courseId}/${this.exerciseId}`]);
  }

  parseHTML(html) {
    let option = document.createElement('div');
    option.innerHTML = html;
    return option.textContent;
  }

  qFormatter(question) {
    let q = question.slice();
    while(q.indexOf('[') !== -1) {
      const inicio = q.indexOf('[');
      const final = q.indexOf(']');
      q = this.parseHTML(q.replace(q.substring(inicio, final +1), '________'));
    }
    return q;
  }
}
