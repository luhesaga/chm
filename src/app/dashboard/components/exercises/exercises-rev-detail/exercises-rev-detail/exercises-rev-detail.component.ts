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
  answers: any = [];
  answersModified: any;
  fecha;
  result;
  tarea = false;

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
    this.answers.length = 0;
    let anwersReceived = this.exerciseService.detailTest(this.courseId, this.exerciseId, this.stdId, this.testId)
      .valueChanges()
      .subscribe(u => {
        // console.log(u);
        this.fecha = new Date(u.fecha).toLocaleDateString();
        if (u.tipo !== 'tarea') {
          this.answers = u.respuestas;
          this.answersModified = u.respuestas.slice()
          this.getTotalResult(u.respuestas);
        } else {
          this.tarea = true;
          if (u.respuestas[0]) {
            this.answers.push(u.respuestas[0]);
          } else {
            this.answers.push(u.respuestas);
          }
          this.answersModified = this.answers.slice();
          this.getTotalResult(this.answers);
        }
        anwersReceived.unsubscribe();
      });
  }

  getTotalResult(answers) {
    let nota: number = 0;
    if (!this.tarea) {
      answers.forEach(r => {
        if (r.valor) {
          nota += r.valor;
        }
      });
      if (nota > 0) {
        this.result = Math.ceil((nota / (answers.length * 100)) * 100);
      } else {
        this.result = 0;
      }
    } else {
      // console.log(answers)
      this.result = answers[0].valor ? answers[0].valor : 0;
    }
  }

  saveCalification(item, i) {
    this.answersModified[i] = item;
    this.getTotalResult(this.answersModified);
  }

  saveTaskCalification() {
    this.answersModified = this.answers;
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

  parseAnswer() {
    let item = document.getElementById('userAnswer');
    item.innerHTML = this.answers[0].respuesta ? this.answers[0].respuesta : 'sin respuesta online';
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
