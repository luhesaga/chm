import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss']
})
export class ExercisesListComponent implements OnInit, OnDestroy {

  courseId: string;
  courseReceived;
  course;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private cursosService: CourseService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    console.log(this.courseId);
  }

  ngOnInit(): void {
    this.courseReceived = this.cursosService.detailCourse(this.courseId).valueChanges()
      .subscribe(curso => {
        this.course = curso;
        console.log(this.course);
      });
  }

  ngOnDestroy(): void {
    this.courseReceived.unsubscribe();
  }

  createOrEditExercise() {
    this.route.navigate([`cursos/ejercicios/crear/${this.courseId}`]);
  }

}
