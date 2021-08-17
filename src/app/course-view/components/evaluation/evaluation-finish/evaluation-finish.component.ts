import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';

@Component({
  selector: 'app-evaluation-finish',
  templateUrl: './evaluation-finish.component.html',
  styleUrls: ['./evaluation-finish.component.scss']
})
export class EvaluationFinishComponent implements OnInit, OnDestroy {

  // datos recibidos
  idCurso;
  idLesson;
  idContent;
  exercId;
  stdId;
  testId;
  revitionView = false;

  testReceived;
  test;

  //anwersReceived;
  answers;

  result: number;
  revition = false;
  revitionAll = false;

  textoFinal: string = 'Haz finalizado la Prueba.';
  mostrarResultados;

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O',
              'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private exerService: ExercisesService,
    private router: Router,
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.exercId = this.activatedRoute.snapshot.params.exercId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.testId = this.activatedRoute.snapshot.params.testId;
    const consulta = this.activatedRoute.snapshot.params.consulta;
    if (consulta) {
      this.revitionView = true;
      // console.log(this.revitionView);
    }
    // console.log(`curso: ${this.idCurso} leccion: ${this.idLesson}`);
    // console.log(`contenido: ${this.idContent} ejercicio: ${this.exercId} usuario: ${this.stdId}`);
  }

  ngOnInit(): void {
    this.getAllTest();
    this.getAnswers();
  }

  ngOnDestroy(): void {
    // this.anwersReceived.unsubscribe();
  }

  getAllTest() {
    const finishExams = this.exerService.getUserAnswers(this.idCurso, this.exercId, this.stdId)
          .valueChanges()
          .subscribe(all => {
            this.getTest(all.length);
            finishExams.unsubscribe();
          })
  }

  getTest(totalTest) {
    let testReceived =this.exerService.exerciseDetail(this.idCurso, this.exercId)
      .valueChanges()
      .subscribe((ex: any) => {
        if (totalTest < ex.intentos) {
          this.revitionAll = false;
        } else {
          this.revitionAll = true;
        }
        this.mostrarResultados = ex.mostrarResultados;
        this.test = ex;
        if (ex.textoFinal) {
          this.textoFinal = this.parseHTML(ex.textoFinal);
        }
        testReceived.unsubscribe();
      });
  }

  getAnswers() {
    let anwersReceived = this.exerService.detailTest(this.idCurso, this.exercId, this.stdId, this.testId)
      .valueChanges()
      .subscribe(u => {
        if (u.fecha) {
          u.fecha = new Date(u.fecha).toLocaleDateString();
        }
        console.log(u);
        this.testReceived = u;
        this.answers = u.respuestas;
        // console.log(this.answers);
        let nota: number = 0;
        let contType5 = 0;
        u.respuestas.forEach(r => {
          nota += r.valor;
          if (r.tipoPregunta === 5) {
            contType5 += 1;
          }
        });
        if (contType5 > 0) { this.revition = true }
        this.result = Math.ceil((nota / (u.respuestas.length * 100)) * 100);
        anwersReceived.unsubscribe();
      });
  }

  goBack(revitionView) {
    const cid = this.idCurso;
    const lid = this.idLesson;
    const sid = this.stdId;
    const cntid = this.idContent;
    if (revitionView) {
      this.router.navigate([`course-view/${cid}/${lid}/${sid}/evaluacion/${cid}/${lid}/${cntid}/${sid}`]);
    } else {
      this.router.navigateByUrl(`dashboard/course-view/${cid}/${lid}/${sid}`);
    }
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
