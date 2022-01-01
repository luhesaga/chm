import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ExercisesService } from '../../../../core/services/exercises/exercises.service';
import { ExercisesCreateComponent } from '../exercises-create/exercises-create.component';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
})
export class ExercisesListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['nombre', 'preguntas', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId: string;
  courseReceived;
  course;
  exercisesReceived;
  careerId;
  careerView = false;
  careerCourses;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cursosService: CourseService,
    private exercise: ExercisesService,
    private careerService: CarrerasService,
    public dialog: MatDialog
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    if (this.activatedRoute.snapshot.params.career === 'career') {
      this.careerView = true;
    }
  }

  ngOnInit(): void {
    if (!this.careerView) {
      this.getCourseInfo();
    } else {
      this.getCareerCourses();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (!this.careerView) {
      if (this.courseReceived) {
        this.courseReceived.unsubscribe();
      }
      if (this.exercisesReceived) {
        this.exercisesReceived.unsubscribe();
      }
    } else {
      if (this.careerCourses) {
        this.careerCourses.unsubscribe();
      }
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourseInfo(): void {
    this.courseReceived = this.cursosService
      .detailCourse(this.courseId)
      .valueChanges()
      .subscribe((curso) => {
        this.course = curso;
        this.getExercisesList(curso);
      });
  }

  getExercisesList(course): void {
    this.exercisesReceived = this.exercise
      .listExercises(course.id)
      .valueChanges()
      .subscribe((ex) => {
        this.dataSource.data = ex;
      });
  }

  getCareerCourses(): void {
    this.careerService
      .getCareerCourses(this.careerId)
      .valueChanges()
      .subscribe((courses) => {
        // console.log(courses);
        this.getCareerExercises(courses);
      });
  }

  getCareerExercises(courses): void {
    const exercises: any[] = [];
    courses.forEach((c) => {
      if (c.tipo === 'ejercicio') {
        exercises.push(c);
      }
    });
    this.dataSource.data = exercises;
  }

  openDialog(exercise): void {
    if (!exercise) {
      exercise = !this.careerView
        ? {
            courseId: this.course.id,
            action: 'new',
          }
        : {
            careerId: this.careerId,
            action: 'new',
          };
    } else {
      if (!this.careerView) {
        exercise.courseId = this.course.id;
        exercise.action = 'edit';
      } else {
        exercise.careerId = this.careerId;
        exercise.action = 'edit';
      }
    }

    const config = {
      data: {
        message:
          exercise.action === 'edit'
            ? 'Editar ejercicio'
            : 'Agregar nuevo ejercicio',
        content: exercise,
      },
    };

    const dialogRef = this.dialog.open(ExercisesCreateComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result ${result}`);
    });
  }

  createOrEditExercise(): void {
    this.router.navigate([`cursos/ejercicios/crear/${this.courseId}`]);
  }

  deleteExercise(data): void {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara este ejercicio permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!',
    })
      .then((result) => {
        if (result.value) {
          if (!this.careerView) {
            this.deleteCourseExercise(data);
          } else {
            this.deleteCareerExercise(data);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  deleteCourseExercise(data): void {
    this.exercise
      .deleteExercise(this.courseId, data.id)
      .then(() => this.successMessage())
      .catch((error) => this.errorMessage(error));
  }

  deleteCareerExercise(data): void {
    this.careerService
      .deleteExercise(this.careerId, data.id)
      .then(() => this.successMessage())
      .catch((error) => this.errorMessage(error));
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
      this.router.navigate([`cursos/index/${this.course.id}`]);
    } else {
      this.router.navigate([`carreras/index/${this.careerId}/${'admin'}`]);
    }
  }

  goToDetail(id): void {
    this.router.navigate([`/cursos/detail/view${id}`]);
  }

  goToQuestionList(id): void {
    if (!this.careerView) {
      this.router.navigate([
        `cursos/ejercicios/${this.courseId}/questions/${id}`,
      ]);
    } else {
      this.router.navigate([
        `cursos/ejercicios-carrera/${this.careerId}/questions/${id}`,
      ]);
    }
  }

  goToResults(evaluation): void {
    if (!this.careerView) {
      this.router.navigate([
        `cursos/ejercicios/revisar/${this.courseId}/${evaluation.id}`,
      ]);
    } else {
      this.router.navigate([
        `cursos/ejercicios-carrera/revisar/${this.careerId}/${evaluation.id}`,
      ]);
    }
  }

  answersQuantity(id): number {
    let largo;
    this.dataSource.data.forEach((ex: any) => {
      if (ex.id === id) {
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
