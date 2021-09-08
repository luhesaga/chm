import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { CourseService } from '../../../../../core/services/courses/course.service';
import { ForumService } from '../../../../../core/services/forums/forum.service';

@Component({
  selector: 'app-forum-users-answers',
  templateUrl: './forum-users-answers.component.html',
  styleUrls: ['./forum-users-answers.component.scss']
})
export class ForumUsersAnswersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['estudiante', 'fecha', 'nota', 'estado', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  courseId;
  lessonId;
  forumId;
  data: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonsService,
    private forumService: ForumService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.lessonId = this.activatedRoute.snapshot.params.lessonId;
    this.forumId = this.activatedRoute.snapshot.params.forumId;
    // console.info(`curso: ${this.courseId} leccion: ${this.lessonId} foro: ${this.forumId}`);
  }

  ngOnInit(): void {
    this.getCourseUsers();
  }

  getCourseUsers() {
    let courseUsers = this.courseService.listRegisteredUsers(this.courseId)
      .valueChanges()
      .subscribe(users => {
        this.usersLoop(users);
        courseUsers.unsubscribe();
      });
  }

  usersLoop(users){
    this.data = []
    users.forEach(u => {
      this.getAnswersByUser(u);
    })
  }

  getAnswersByUser(user) {
    let uAnswers = this.forumService.getUserAnswers(this.courseId, this.lessonId, this.forumId, user.id)
      .valueChanges()
      .subscribe((answers: any) => {
        if (answers.length > 0) {
          this.getOriginalForum(answers[0]);
        }
        uAnswers.unsubscribe();
      })

  }

  getOriginalForum(answers) {
    let forum = this.lessonService.lessonContentDetail(this.courseId, this.lessonId, this.forumId)
      .valueChanges()
      .subscribe((f: any) => {
        if (f.foroCalificable) {
          let foro: any = {
            fecha: new Date(answers.fecha).toLocaleDateString(),
            estudiante: answers.nombreCompleto,
            idEstudiante: answers.usuarioId,
            foroId: answers.id,
            nota: answers.valor ? answers.valor : 0,
            tipo: f.foroTipoCalificacion,
          }
          if (f.foroTipoCalificacion === 'Manual') {
            foro.estado = answers.estado ? answers.estado : 'Pendiente calificar';
          } else if (f.foroTipoCalificacion === 'Automatica') {
            foro.estado = 'Calificado';
          }

          this.data.push(foro);
          this.dataSource.data = this.data;
          // console.log(this.dataSource.data);
        }
        forum.unsubscribe();
      })

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToUserAnswer(element: any) {
    const cid = this.courseId;
    const lid = this.lessonId;
    const fid = this.forumId;
    const stdid = element.idEstudiante;
    const fuid = element.foroId;
    this.router.navigate([`cursos/foros/revisar/respuesta-estudiante/${cid}/${lid}/${fid}/${stdid}/${fuid}`]);
  }

  goBack() {
    this.router.navigate([`cursos/foros/revisar/${this.courseId}`]);
  }

}
