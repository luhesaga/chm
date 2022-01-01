import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { AsyncSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize, map } from 'rxjs/operators';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-evaluation-home',
  templateUrl: './evaluation-home.component.html',
  styleUrls: ['./evaluation-home.component.scss'],
})
export class EvaluationHomeComponent implements OnInit, OnDestroy, DoCheck {
  private editorSubject: Subject<any> = new AsyncSubject();

  idCurso;
  idLesson;
  idContent;
  stdId;
  exercId;

  courseReceived;
  course;

  // lessonReceived;
  lesson;

  // evaluationReceived;
  evaluation;
  exercises;
  questions;

  userTries = 0;
  canViewTest = true;
  previousTest;
  previousTestAnswers: any = [];

  tarea = 0;
  userAnswer;
  documentType;

  // para cargar archivos
  edit = false;
  archivo;
  ruta;
  question;
  percentageProgressBar = 0;
  showProgressBar = false;
  archives: any = [];
  fsId;
  changePDF;
  confirmDelPDF;
  public url = new URL('http://pdfviewer.net/assets/pdfs/GraalVM.pdf');

  calificacion: any;
  comentarioTutor;
  careerView = false;
  careerId: string;
  careerReceived;
  std = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private careerService: CarrerasService,
    private lessonService: LessonsService,
    private exerciseService: ExercisesService,
    private fs: AngularFireStorage,
    private fireStore: AngularFirestore
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    this.idLesson = this.activatedRoute.snapshot.params.idLesson;
    this.idContent = this.activatedRoute.snapshot.params.idContent;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    const stdView = this.activatedRoute.snapshot.params.std;
    if (stdView) {
      this.std = true;
    }
    // console.log(this.careerView);
    // console.log(`curso: ${this.idCurso} leccion: ${this.idLesson}`);
    // console.log(
    //   `contenido: ${this.idContent} usuario: ${this.stdId} carrera: ${this.careerId}`
    // );
  }

  ngOnInit(): void {
    if (!this.careerView) {
      this.getCourse();
      this.getLesson();
      this.getLessonEvaluation();
    } else {
      this.getCareerInfo();
    }
  }

  ngOnDestroy(): void {
    if (this.courseReceived) {
      this.courseReceived.unsubscribe();
    }
    // this.lessonReceived.unsubscribe();
    // this.evaluationReceived.unsubscribe();
  }

  ngDoCheck(): void {
    // Validar mismo componente diferente contenido
    const idContent = this.activatedRoute.snapshot.params.idContent;
    if (idContent !== this.idContent) {
      this.idContent = idContent;
      this.ngOnInit();
    }
  }

  handleEditorInit(e): void {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  getCourse(): void {
    this.courseReceived = this.courseService
      .detailCourse(this.idCurso)
      .valueChanges()
      .subscribe((course) => {
        this.course = course;
        console.log(this.course);
      });
  }

  getLesson(): void {
    const lessonReceived = this.lessonService
      .lessonDetail(this.idCurso, this.idLesson)
      .valueChanges()
      .subscribe((lesson) => {
        this.lesson = lesson;
        console.log(this.lesson);
        lessonReceived.unsubscribe();
      });
  }

  getLessonEvaluation(): void {
    const evaluationReceived = this.lessonService
      .lessonContentDetail(this.idCurso, this.idLesson, this.idContent)
      .valueChanges()
      .subscribe((content: any) => {
        this.evaluation = content;
        this.getPreviousTries(content);
        // gfgfgf
        console.log(this.evaluation);
        evaluationReceived.unsubscribe();
      });
  }

  getPreviousTries(content): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    this.exercId = content.ejercicio ? content.ejercicio.id : content.id;
    const exc = this.exerciseService
      .getUserAnswers(cid, this.exercId, this.stdId)
      .valueChanges()
      .subscribe((exd) => {
        this.previousTest = exd;
        if (exd) {
          this.userTries = exd.length;
        }
        this.getExerciseDetail(content);
        exc.unsubscribe();
      });
  }

  getExerciseDetail(content): void {
    if (!this.careerView) {
      const exc = this.exerciseService
        .exerciseDetail(this.idCurso, content.ejercicio.id)
        .valueChanges()
        .subscribe((exerc: any) => {
          console.log(exerc);
          this.setExercise(exerc);
          this.getPreviousTestAnswers(content);
          // console.log(`puede ver la prueba: ${this.canViewTest}`);
          exc.unsubscribe();
        });
    } else {
      this.setExercise(content);
    }
  }

  setExercise(content): void {
    this.exercises = content;
    if (content.preguntas[0]?.type === 6) {
      const exerId = this.careerView ? content.id : content.ejercicio.id;
      this.prepareTest(content, exerId);
    } else {
      this.tarea = 1;
      this.questions = content.preguntas;
      if (this.userTries >= content.intentos) {
        this.canViewTest = false;
      }
      if (this.careerView) {
        this.getPreviousTestAnswers(content);
      }
    }
  }

  prepareTest(test, exId): void {
    this.tarea = 2;
    this.documentType = this.exercises.preguntas[0].tarea.tipoDocumento;
    this.getTestDetail(exId);
  }

  getTestDetail(exId): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const test = this.exerciseService
      .getUserAnswers(cid, exId, this.stdId)
      .valueChanges()
      .subscribe((t) => {
        if (t[0]) {
          this.edit = true;
          this.fsId = t[0].id;

          if (t[0].respuestas[0]) {
            this.calificacion = t[0].respuestas[0].valor
              ? t[0].respuestas[0].valor + '%'
              : 'pendiente por calificar.';
            this.comentarioTutor = t[0].respuestas[0].retro
              ? t[0].respuestas[0].retro
              : 'Sin comentarios del tutor.';
            this.question = t[0].respuestas[0].question;
            this.ruta = t[0].respuestas[0].ruta;
            this.archivo = t[0].respuestas[0].archivo;
            this.userAnswer = this.parseHTML(t[0].respuestas[0].respuesta);
          } else {
            this.calificacion = t[0].respuestas.valor
              ? t[0].respuestas.valor + '%'
              : 'pendiente por calificar.';
            this.comentarioTutor = t[0].respuestas.retro
              ? t[0].respuestas.retro
              : 'Sin comentarios del tutor.';
            this.question = t[0].respuestas.question;
            this.ruta = t[0].respuestas.ruta;
            this.archivo = t[0].respuestas.archivo;
            this.userAnswer = this.parseHTML(t[0].respuestas.respuesta);
          }
        }
        if (!this.edit) {
          this.fsId = this.fireStore.createId();
        }
        test.unsubscribe();
      });
  }

  setDocType(): any {
    let docType;
    switch (this.documentType) {
      case 1:
        docType = 'Puede escribir su respuesta o subir un documento.';
        break;
      case 2:
        docType = 'Por favor escriba su respuesta.';
        break;
      case 3:
        docType = 'Por favor cargue un archivo de Word o PDF con su respuesta.';
        break;
      default:
        break;
    }
    return docType;
  }

  setQuestion(): void {
    const question = document.getElementById('test-question');
    if (question) {
      question.innerHTML = this.exercises.preguntas[0].question;
    }
  }

  getPreviousTestAnswers(content): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const eid = this.careerView ? content.id : content.ejercicio.id;
    this.previousTestAnswers.length = 0;
    this.previousTest.forEach((pt) => {
      const prTsAn = this.exerciseService
        .detailTest(cid, eid, this.stdId, pt.id)
        .valueChanges()
        .subscribe((pta) => {
          let cont = 0;
          let valor = 0;
          // const fecha = new Date(pta.fecha);
          // console.log(fecha.toLocaleDateString());
          pta.respuestas.forEach((r) => {
            if (r.valor) {
              valor += r.valor;
              if (r.correcta) {
                cont += 1;
              }
            }
          });
          // console.log(valor);
          pta.nota = Math.ceil(((valor / pta.respuestas.length) * 100) / 100);
          pta.correctas = cont;
          this.previousTestAnswers.push(pta);
          // console.log(this.previousTestAnswers);
          prTsAn.unsubscribe();
        });
    });
  }

  getAnswersToPass(): number {
    let intentos = 0;
    if (this.questions && this.exercises) {
      const q = this.questions.length;
      const p = this.exercises.porcentaje;

      intentos = Math.ceil(q * (p / 100));
    }

    return intentos;
  }

  markAsViewed(): void {
    const progress = this.lessonService
      .ContentProgress(this.idCurso, this.idLesson, this.idContent, this.stdId)
      .valueChanges()
      .subscribe((p) => {
        if (!p) {
          this.lessonService
            .CreateContentProgress(
              this.idCurso,
              this.idLesson,
              this.idContent,
              this.stdId
            )
            .then(() => console.log('actualizado'))
            .catch((error) => console.log(error));
        }
        progress.unsubscribe();
      });
  }

  startExam(): void {
    if (!this.careerView) {
      if (this.canViewTest) {
        const cid = this.idCurso;
        const lid = this.idLesson;
        const cntid = this.idContent;
        const exid = this.exercises.id;
        const stdid = this.stdId;
        this.markAsViewed();
        this.router.navigate([
          `course-view/ver-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}`,
        ]);
      } else {
        Swal.fire({
          icon: 'error',
          title: '!Error!',
          text: 'No tiene más intentos para esta prueba.',
          confirmButtonText: 'cerrar',
        });
      }
    } else {
      const cid = this.careerId;
      const lid = this.idLesson;
      const exid = this.exercises.id;
      const stdid = this.stdId;
      this.router.navigate([
        `course-view/ver-evaluacion/${cid}/${lid}/${exid}/${stdid}`,
      ]);
    }
  }

  goToTestResult(id): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const lid = this.idLesson;
    const cntid = this.idContent;
    const exid = this.exercId;
    const stdid = this.stdId;
    if (!this.careerView) {
      this.router.navigate([
        `course-view/${cid}/${lid}/${stdid}/final-evaluacion/${cid}/${lid}/${cntid}/${exid}/${stdid}/${id}/consulta`,
      ]);
    } else {
      this.router.navigate([
        `final-evaluacion/${cid}/${stdid}/${exid}/${id}/:consulta`,
      ]);
    }
  }

  goBack(): void {
    if (!this.std) {
      this.router.navigate([
        `dashboard/mis-cursos-lecciones-carrera/${this.stdId}/${this.careerId}`,
      ]);
    } else {
      this.router.navigate([
        `dashboard/mis-cursos-lecciones-carrera/${this.stdId}/${this.careerId}/${'std'}`,
      ]);
    }
  }

  saveOrUpdateTest(): void {
    switch (this.documentType) {
      case 1:
        if (!this.userAnswer && !this.archivo) {
          Swal.fire({
            icon: 'error',
            title: '!Error!',
            text: 'Debe escribir una respuesta o subir un archivo.',
            confirmButtonText: 'cerrar',
          });
        } else {
          this.saveTest();
        }
        break;
      case 2:
        if (!this.userAnswer) {
          Swal.fire({
            icon: 'error',
            title: '!Error!',
            text: 'Debe escribir una respuesta.',
            confirmButtonText: 'cerrar',
          });
        } else {
          this.saveTest();
        }
        break;
      case 3:
        if (!this.archivo) {
          Swal.fire({
            icon: 'error',
            title: '!Error!',
            text: 'Debe subir un archivo.',
            confirmButtonText: 'cerrar',
          });
        } else {
          this.saveTest();
        }
        break;
      default:
        break;
    }
  }

  saveTest(): void {
    const respuesta = this.prepareTestAnswer();
    const cid = this.careerView ? this.careerId : this.idCurso;
    this.exerciseService
      .addUserJob(cid, this.exercId, this.stdId, respuesta, this.fsId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '!Cambios guardados!',
          text: 'Su respuesta ha sido guardada exitosamente, espera la calificación del tutor.',
          confirmButtonText: 'cerrar',
        });
        if (!this.careerView) {
          this.markAsViewed();
        }
        this.ngOnInit();
      })
      .catch((err) => console.log(err));
  }

  prepareTestAnswer(): any {
    return {
      question: this.parseHTML(this.exercises.preguntas[0].question),
      respuesta: this.userAnswer ? this.userAnswer : '',
      archivo: this.archivo ? this.archivo : '',
      ruta: this.ruta ? this.ruta : '',
    };
  }

  parseHTML(html): string {
    const option = document.createElement('div');
    option.innerHTML = html;
    return option.textContent;
  }

  uploadPDF(event): void {
    this.uploadNewPDF(event);
  }

  uploadNewPDF(event): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const lid = this.idLesson;
    const cntid = this.idContent;
    const exid = this.exercId;

    this.showProgressBar = true;
    const file = event.target.files[0] as File;
    const name = file.name;
    let fileRef;
    let path;
    if (!this.careerView) {
      fileRef = this.fs.ref(
        `ejercicios/${cid}/tareas/${lid}/${cntid}/${this.fsId}/${name}`
      );
      path = `ejercicios/${cid}/tareas/${lid}/${cntid}/${this.fsId}/${file.name}`;
    } else {
      fileRef = this.fs.ref(
        `ejercicios/${cid}/tareas/${exid}/${this.fsId}/${name}`
      );
      path = `ejercicios/${cid}/tareas/${exid}/${this.fsId}/${file.name}`;
    }
    const task = this.fs.upload(path, file);

    task
      .percentageChanges()
      .pipe(map(Math.ceil))
      .pipe(
        finalize(() => {
          const urlFile = fileRef.getDownloadURL();
          urlFile.subscribe((url) => {
            this.ruta = url;
            // console.log(this.archivoField);
            // borrar imagen previamente cargada
            if (this.archives.length > 0) {
              this.deletePDF(file.name);
              this.archives.length = 0;
            }
            this.archives.push(name);
            this.archivo = file.name;
          });
          this.showProgressBar = false;
        })
      )
      .subscribe((per) => {
        this.percentageProgressBar = per;
      });
  }

  deletePDF(PDFName): void {
    const cid = this.careerView ? this.careerId : this.idCurso;
    const lid = this.idLesson;
    const cntid = this.idContent;
    const exid = this.exercId;
    let url;
    if (this.edit) {
      if (this.confirmDelPDF !== PDFName && this.confirmDelPDF !== null) {
        url = this.confirmDelPDF;
        if (!this.careerView) {
          this.fs
            .ref(`ejercicios/${cid}/tareas/${lid}/${cntid}/${this.fsId}/${url}`)
            .delete();
        } else {
          this.fs
            .ref(`ejercicios/${cid}/tareas/${exid}/${this.fsId}/${url}`)
            .delete();
        }
      }
    } else {
      url = this.archives[0];
      if (!this.careerView) {
        this.fs
          .ref(`ejercicios/${cid}/tareas/${lid}/${cntid}/${this.fsId}/${url}`)
          .delete();
      } else {
        this.fs
          .ref(`ejercicios/${cid}/tareas/${exid}/${this.fsId}/${url}`)
          .delete();
      }
    }
  }

  // Vista carreras
  getCareerInfo(): void {
    const career = this.careerService
      .obtenerCarrera(this.careerId)
      .valueChanges()
      .subscribe((c) => {
        this.careerReceived = c;
        this.getCareerExercise();
        career.unsubscribe();
      });
  }

  getCareerExercise(): void {
    const ex = this.careerService
      .exerciseDetail(this.careerId, this.idLesson)
      .valueChanges()
      .subscribe((exerc: any) => {
        this.exercises = exerc;
        this.tarea = 1;
        this.tarea = 1;
        this.questions = exerc.preguntas;
        this.getPreviousTries(exerc);
      });
  }
}
