import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../../../../core/services/forums/forum.service';
import { LessonsService } from '../../../../../core/services/lessons/lessons.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forum-rev-detail',
  templateUrl: './forum-rev-detail.component.html',
  styleUrls: ['./forum-rev-detail.component.scss']
})
export class ForumRevDetailComponent implements OnInit {

  courseId;
  lessonId;
  forumId;
  stdId;
  userForumId;

  forum;
  userForum;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private forumService: ForumService,
    private lessonService: LessonsService,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.lessonId = this.activatedRoute.snapshot.params.lessonId;
    this.forumId = this.activatedRoute.snapshot.params.forumId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    this.userForumId = this.activatedRoute.snapshot.params.userForumId;
  }

  ngOnInit(): void {
    this.getForumAnswer();
    this.getForum();
  }

  getForumAnswer() {
    let answer = this.forumService.getDetailAnswer(this.courseId, this.lessonId, this.forumId, this.stdId, this.userForumId)
      .valueChanges()
      .subscribe(f => {
        this.userForum = f;
        answer.unsubscribe();
      })
  }

  getForum() {
    let lesson = this.lessonService.lessonContentDetail(this.courseId, this.lessonId, this.forumId)
      .valueChanges()
      .subscribe(l => {
        this.forum = l;
        lesson.unsubscribe();
      })
  }

  saveForumRevition() {
    const data = {
      valor: this.userForum.valor,
      estado: 'Calificado'
    }

    this.forumService.setForumRevition(data, this.courseId, this.lessonId, this.forumId, this.stdId, this.userForumId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Foro calificado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.goBack();
      })
      .catch(err => console.error(err));
  }

  goBack() {
    this.router.navigate([`cursos/foros/revisar/respuestas/${this.courseId}/${this.lessonId}/${this.forumId}`]);
  }

  parseAnswer(id, html) {
    let item = document.getElementById(id);
    item.innerHTML = html;
  }

}
