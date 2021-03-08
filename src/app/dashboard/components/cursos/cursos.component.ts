import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../core/services/courses/course.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {

  cursos;

  constructor(
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.cursos = this.courseService.listCourses().valueChanges();
  }

}
