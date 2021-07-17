import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetsService } from 'src/app/core/services/meets/meets.service';
import { VideoConferenceCreateComponent } from '../video-conference-create/video-conference-create.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-conference-list',
  templateUrl: './video-conference-list.component.html',
  styleUrls: ['./video-conference-list.component.scss']
})
export class VideoConferenceListComponent implements OnInit, OnDestroy {

  courseId;
  meetsReceived;
  meets;
  stdId;
  admin = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public dialog: MatDialog,
    private meetService: MeetsService
  ) {
    this.courseId = this.activatedRoute.snapshot.params.courseId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    if (this.stdId) {
      this.admin = false;
    }
  }

  ngOnInit(): void {
    this.getMeets();
  }

  ngOnDestroy(): void {
    this.meetsReceived.unsubscribe();
  }

  getMeets() {
    this.meetsReceived = this.meetService.listMeets(this.courseId)
        .valueChanges()
        .subscribe(m => {
          this.meets = m;
        });
  }

  createVideoMeet(data): void {
    if (data) {
      data.courseId = this.courseId;
      data.action = 'edit'
    } else {
      data = {
        courseId: this.courseId,
        action: 'new'
      }
    }
    const config = {
      data: {
        message: data.action,
        content: data
      }
    };

    const dialogRef = this.dialog.open(VideoConferenceCreateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

  deleteMeet(data) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara esta reunión permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        this.meetService.deleteMeet(this.courseId, data.id)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Reunión eliminada exitosamente',
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
    if (this.admin) {
      this.route.navigate([`cursos/index/${this.courseId}`]);
    } else {
      this.route.navigate([`cursos/index/${this.courseId}/${this.stdId}`]);
    }
  }

  parseHTML(data) {
    let p = document.getElementById(data.id);
    p.innerHTML = data.descripcion;
  }

  getLink(link) {

    if (link.indexOf('https') === -1) {
      link = 'https://' + link;
    }

    return link;
  }

}
