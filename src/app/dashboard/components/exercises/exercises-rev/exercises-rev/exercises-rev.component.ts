import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from '../../../../../core/services/exercises/exercises.service';
import { CourseService } from '../../../../../core/services/courses/course.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private exerciseService: ExercisesService,
    private courseService: CourseService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.exerciseId = this.activatedRoute.snapshot.params.exerciseId;
  }

  ngOnInit(): void {
    this.getRegisteredUsers();
    this.getExerciseDeatil();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRegisteredUsers() {
    this. data = [];
    let regUsers = this.courseService.listRegisteredUsers(this.courseId)
      .valueChanges()
      .subscribe(users => {
        users.forEach(u => {
          this.getUserResults(u);
        });
        regUsers.unsubscribe();
      });
  }

  getUserResults(u: any) {
    let userTest = this.exerciseService.getUserAnswers(this.courseId, this.exerciseId, u.id)
      .valueChanges()
      .subscribe((item: any) => {
        if (item.length > 0) {
          item.forEach(test => {
            let fecha = new Date(test.fecha).toLocaleDateString();
            let valor = 0;
            test.respuestas.forEach(result => {
              valor += result.valor;
            })
            valor = Math.ceil((valor / (test.respuestas.length * 100)) * 100);
            this.data.push({
              nombreEstudiante: u.nombre,
              idEstudiante: u.id,
              idTest: test.id,
              nota: valor,
              resultados: test,
              fecha: fecha,
              estado: test.revisado ? 'Revisada' : 'Pendiente por revisión'
            })
          })
        }
        userTest.unsubscribe();
        this.dataSource.data = this.data;
      });
  }

  getExerciseDeatil() {
    let exerc = this.exerciseService.exerciseDetail(this.courseId, this.exerciseId)
      .valueChanges()
      .subscribe(ex => {
        this.exercise = ex;
        exerc.unsubscribe();
      });
  }

  goToCheckTest(element) {
    const cid = this.courseId;
    const exeid = this.exerciseId;
    const tid = element.idTest;
    const stdid = element.idEstudiante;
    this.router.navigate([`cursos/ejercicios/revisar/detalle/${cid}/${exeid}/${tid}/${stdid}`]);
  }

  deleteTest(test) {
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
                  this.courseId,
                  this.exerciseId,
                  test.idEstudiante,
                  test.idTest)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Ejercicio eliminado exitosamente',
            confirmButtonText: 'cerrar',
          });
          this.ngOnInit();
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

  goBack() {
    this.router.navigate([`cursos/ejercicios/${this.courseId}`]);
  }

}
