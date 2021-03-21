import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../../core/services/courses/course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  panelOpenState = false;
  cursos:any = [];
  id;

  constructor(
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.courseService.detailCourse(this.id)
      .valueChanges()
      .subscribe(curso => {
        this.cursos.push(curso);
        console.log(this.cursos);
      });
    
    console.log(this.id);
    
  }

}
