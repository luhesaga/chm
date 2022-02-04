import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from '../../../../../core/services/exercises/exercises.service';
import { CourseService } from '../../../../../core/services/courses/course.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-exercises-rev',
  templateUrl: './exercises-rev.component.html',
  styleUrls: ['./exercises-rev.component.scss']
})
export class ExercisesRevComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['estudiante', 'fecha', 'puntuacion', 'estado', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId;
  exerciseId;
  data;
  exercise;

  careerId: string;
  careerView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private exerciseService: ExercisesService,
    private courseService: CourseService,
    private careerService: CarrerasService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.careerId) {
      this.careerView = true;
    }
    console.log(this.careerView);
  }

  ngOnInit(): void {
    if (!this.careerView) {
      this.getCourseRegisteredUsers();
    } else {
      this.getCareerRegisteredUsers();
    }
    this.getExerciseDeatil();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourseRegisteredUsers(): void {
    this. data = [];
    const regUsers = this.courseService.listRegisteredUsers(this.courseId)
      .valueChanges()
      .subscribe(users => {
        users.forEach(u => {
          this.getUserResults(u);
        });
        regUsers.unsubscribe();
      });
  }

  getCareerRegisteredUsers(): void {
    this. data = [];
    const regUsers = this.careerService.matriculadosObtener(this.careerId)
      .valueChanges()
      .subscribe(users => {
        users.forEach(u => {
          this.getUserResults(u);
        });
        regUsers.unsubscribe();
      });
  }

  getUserResults(u: any): void {
    const cid = this.careerView ? this.careerId : this.courseId;
    const userTest = this.exerciseService.getUserAnswers(cid, this.exerciseId, u.id)
      .valueChanges()
      .subscribe((item: any) => {
        if (item.length > 0) {
          item.forEach(test => {
            const fecha = new Date(test.fecha).toLocaleDateString();
            if (!test.tipo) {
              let valor = 0;
              test.respuestas.forEach(result => {
                valor += result.valor;
              });
              valor = Math.ceil((valor / (test.respuestas.length * 100)) * 100);
              this.data.push({
                nombreEstudiante: u.nombre,
                idEstudiante: u.id,
                idTest: test.id,
                nota: valor,
                resultados: test,
                fecha,
                estado: test.revisado ? 'Revisada' : 'Pendiente por revisión'
              });
            } else {
              if (test.respuestas[0]) {
                this.data.push({
                  nombreEstudiante: u.nombre,
                  idEstudiante: u.id,
                  idTest: test.id,
                  resultados: test,
                  nota: test.respuestas[0].valor ? test.respuestas[0].valor : 0,
                  fecha,
                  estado: test.revisado ? 'Revisada' : 'Pendiente por revisión'
                });
              } else {
                this.data.push({
                  nombreEstudiante: u.nombre,
                  idEstudiante: u.id,
                  idTest: test.id,
                  resultados: test,
                  nota: test.respuestas.valor ? test.respuestas.valor : 0,
                  fecha,
                  estado: test.revisado ? 'Revisada' : 'Pendiente por revisión'
                });
              }
            }
          });
        }
        userTest.unsubscribe();
        this.dataSource.data = this.data;
      });
  }

  getExerciseDeatil(): void {
    const cid = this.careerView ? this.careerId : this.courseId;
    if (!this.careerView) {
      this.getCourseExerciseDetail(cid);
    } else {
      this.getCareerExerciseDetail(cid);
    }
  }

  getCourseExerciseDetail(cid: string): void {
    const exerc = this.exerciseService.exerciseDetail(cid, this.exerciseId)
      .valueChanges()
      .subscribe(ex => {
        // console.log(ex);
        this.exercise = ex;
        exerc.unsubscribe();
      });
  }

  getCareerExerciseDetail(cid): void {
    const exerc = this.careerService.exerciseDetail(cid, this.exerciseId)
      .valueChanges()
      .subscribe(ex => {
        this.exercise = ex;
        exerc.unsubscribe();
      });
  }

  goToCheckTest(element): void {
    const cid = this.careerView ? this.careerId : this.courseId;
    const exeid = this.exerciseId;
    const tid = element.idTest;
    const stdid = element.idEstudiante;
    if (!this.careerView) {
      this.router.navigate([`cursos/ejercicios/revisar/detalle/${cid}/${exeid}/${tid}/${stdid}`]);
    } else {
      this.router.navigate([`cursos/ejercicios-carrera/revisar/detalle/${cid}/${exeid}/${tid}/${stdid}`]);
    }
  }

  deleteTest(test): void {
    const cid = this.careerView ? this.careerId : this.courseId;
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara este ejercicio del estudiante permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        this.exerciseService
        .deleteTest(
                  cid,
                  this.exerciseId,
                  test.idEstudiante,
                  test.idTest)
        .then(() => {
          this.successMessage();
          this.ngOnInit();
        })
        .catch((error) => {
          this.errorMessage(error);
        });
      }
    })
    .catch(error => console.log(error));
  }

  successMessage(): void {
    Swal.fire({
      icon: 'success',
      title: 'Exito!',
      text: 'Ejercicio eliminado exitosamente',
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

  goBack(): void {
    if (!this.careerView) {
      this.router.navigate([`cursos/ejercicios/${this.courseId}`]);
    } else {
      this.router.navigate([`cursos/ejercicios/${this.careerId}/${'career'}`]);
    }
  }

}
