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
    // console.log(this.courseId);
  }

  ngOnInit(): void {
    this.courseReceived = this.cursosService.detailCourse(this.courseId).valueChanges()
      .subscribe(curso => {
        this.course = curso;
        // console.log(this.course);
        this.exercise
          .listExercises(curso.id)
          .valueChanges()
          .subscribe(ex => {
              // console.log(ex);
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
    let data;
    if (!exercise) {
      data = {
        courseId: this.course.id,
        action: 'new'
      }
    } else {
      data = {
        courseId: this.course.id,
        exerciseId: exercise.id,
        action: 'edit',
        name: exercise.nombre
      }
    }
    const config = {
      data: {
        message: data.action === 'edit' ? 'Editar ejercicio' : 'Agregar nuevo ejercicio',
        content: data
      }
    };

    const dialogRef = this.dialog.open(ExercisesCreateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

  createOrEditExercise() {
    this.router.navigate([`cursos/ejercicios/crear/${this.courseId}`]);
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
