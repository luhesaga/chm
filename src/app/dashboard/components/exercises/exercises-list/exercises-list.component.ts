import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import { ExercisesCreateComponent } from '../exercises-create/exercises-create.component';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss']
})
export class ExercisesListComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'preguntas', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId: string;
  courseReceived;
  course;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cursosService: CourseService,
    private exercise: ExercisesService,
    public dialog: MatDialog,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
  }

  ngOnInit(): void {
    this.courseReceived = this.cursosService.detailCourse(this.courseId).valueChanges()
      .subscribe(curso => {
        this.course = curso;
        this.exercise
          .listExercises(curso.id)
          .valueChanges()
          .subscribe(ex => {
              this.dataSource.data = ex;
            });
          });
  };

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.courseReceived.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(exercise){
    if (!exercise) {
      exercise = {
        courseId: this.course.id,
        action: 'new'
      }
    } else {
      exercise.courseId = this.course.id;
      exercise.action = 'edit';
    }

    const config = {
      data: {
        message: exercise.action === 'edit' ? 'Editar ejercicio' : 'Agregar nuevo ejercicio',
        content: exercise
      }
    };

    const dialogRef = this.dialog.open(ExercisesCreateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result ${result}`);
    });
  }

  createOrEditExercise() {
    this.router.navigate([`cursos/ejercicios/crear/${this.courseId}`]);
  }

  deleteExercise(data) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara este ejercicio permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        this.exercise.deleteExercise(this.courseId, data.id)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Ejercicio eliminado exitosamente',
            confirmButtonText: 'cerrar',
        });
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
    this.router.navigate([`cursos/index/${this.course.id}`]);
  }

  goToDetail(id) {
    this.router.navigate([`/cursos/detail/view${id}`]);
  }

  goToQuestionList(id) {
    this.router.navigate([`cursos/ejercicios/${this.courseId}/questions/${id}`]);
  }

  goToResults(evaluation) {
    this.router.navigate([`cursos/ejercicios/revisar/${this.courseId}/${evaluation.id}`]);
  }

  answersQuantity(id): number {
    let largo;
    this.dataSource.data.forEach((ex: any) => {
      if (ex.id === id) {
        //console.log(ex);
        if (ex.preguntas) {
          largo = ex.preguntas.length;
        } else {
          largo = 0;
        }
      }
    });

    return largo;
  }

}
