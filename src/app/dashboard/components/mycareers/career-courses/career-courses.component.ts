import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';
import { CourseService } from '../../../../core/services/courses/course.service';

@Component({
  selector: 'app-career-courses',
  templateUrl: './career-courses.component.html',
  styleUrls: ['./career-courses.component.scss']
})
export class CareerCoursesComponent implements OnInit {

  userId: string;
  careerId: string;
  careerCourses: any;
  careerReceived: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private careerService: CarrerasService,
    private courseService: CourseService,

  ) {
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    this.userId = this.activatedRoute.snapshot.params.stdId;
  }

  ngOnInit(): void {
    this.getCareer();
    this.getCareerCoursesList();
  }

  getCareer() {
    let career = this.careerService.obtenerCarrera(this.careerId)
      .valueChanges()
      .subscribe(c => {
        console.log(c);
        this.careerReceived = c;
        career.unsubscribe();
      })
  }

  getCareerCoursesList() {
    let courseList = this.careerService.getCareerCourses(this.careerId)
      .valueChanges()
      .subscribe(courses => {
        console.log(courses)
        this.getCourseInfo(courses);
        courseList.unsubscribe();
      })
  }

  getCourseInfo(courses) {
    this.careerCourses = [];
    courses.forEach(course => {
      let careerCourses = this.courseService.detailCourse(course.id)
        .valueChanges()
        .subscribe(c => {
          console.log(c);
          this.careerCourses.push(c);
          careerCourses.unsubscribe();
        })
    })
  }

  goToCourseHome(idCourse: string) {
    this.router.navigateByUrl(`cursos/index/${idCourse}/${this.userId}/${this.careerId}`);
  }

}
