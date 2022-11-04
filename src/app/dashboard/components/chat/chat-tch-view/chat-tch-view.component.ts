import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../../core/services/chat/chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-tch-view',
  templateUrl: './chat-tch-view.component.html',
  styleUrls: ['./chat-tch-view.component.scss']
})
export class ChatTchViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'estudiante',
    'fecha',
    'estado',
    'actions',
  ];
  dataSource = new MatTableDataSource();

  courseId;

  preguntasSubs;

  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private router: Router,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    console.log('curso id: ' + this.courseId);
  }

  ngOnInit(): void {
    this.getCourseQuestions();
  }

  ngOnDestroy(): void {
    if (this.preguntasSubs) {
      this.preguntasSubs.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourseQuestions(): void {
    this.preguntasSubs = this.chatService.getCourseQuestions(this.courseId)
      .valueChanges()
      .subscribe(questions => {
        questions.forEach(q => {
          q.fechaPregunta = this.formatDate(q.fechaPregunta);
          if (q.leida) {
            q.estadoQ = 'Respondida';
          } else {
            q.estadoQ = 'Pendiente';
          }
        });
        this.dataSource.data = questions;
      });
  }

  goToAnswer(element): void {
    this.router.navigate([`cursos/chat-pregunta/${element.idCurso}/${element.id}`]);
  }

  questionDelete(element): void {
    Swal.fire({
      title: '¿Esta seguro?',
      icon: 'warning',
      text: 'Al borrar esta pregunta, no puede ser recuperada, se borrara tambien del chat del estudiante.',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.chatService.deleteQuestion(element.idCurso, element.id)
            .then(() => {
              Swal.fire(
                'Exito',
                `Pregunta eliminada.`,
                'success'
              );
            })
            .catch((err) => {
              Swal.fire(
                'Error',
                `No se pudó eliminar la pregunta. ${err}.`,
                'error'
              );
            });
        }
      })
      .catch((err) => console.log(err));
  }

  goBack(): void {
    this.router.navigate([`cursos/index/${this.courseId}`]);
  }

  formatDate(date): string {
    const ultimoIngreso = new Date(date.seconds * 1000);
    return ultimoIngreso.toLocaleString();
  }

}
