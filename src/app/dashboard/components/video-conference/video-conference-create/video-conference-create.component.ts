import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { MeetsService } from 'src/app/core/services/meets/meets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-conference-create',
  templateUrl: './video-conference-create.component.html',
  styleUrls: ['./video-conference-create.component.scss']
})
export class VideoConferenceCreateComponent implements OnInit {

  private editorSubject: Subject<any> = new AsyncSubject();

  form: FormGroup;

  videoId;
  videoTitle;
  videoUrl;
  videoDescription;

  edit = false;
  courseId;

  constructor(
    public dialogRef: MatDialogRef<VideoConferenceCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private dataReceived,
    private formBuilder: FormBuilder,
    private meetService: MeetsService
  ) {
    this.getDataReceived();
    this.buildForm();
  }

  ngOnInit(): void { }

  getDataReceived() {
    if (this.dataReceived.message === 'edit') {
      this.edit = true;
      this.videoId = this.dataReceived.content.id;
      this.videoTitle = this.dataReceived.content.nombre;
      this.videoUrl = this.dataReceived.content.url;
      this.videoDescription = this.dataReceived.content.descripcion;
    }
    this.courseId = this.dataReceived.content.courseId;
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required,],
      url: ['', Validators.required],
      description: [''],
    })
  }

  get nameField() {
    return this.form.get('name');
  }

  get urlField() {
    return this.form.get('url');
  }

  get descriptionField() {
    return this.form.get('description');
  }

  saveOrEditMeet(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.edit) {
        this.saveMeet();
      } else {
        this.editMeet();
      }
    }
  }

  saveMeet() {
    this.meetService.createMeet(this.form.value, this.courseId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Reunión creada exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.dialogRef.close();
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

  editMeet() {
    this.meetService.editMeet(this.form.value, this.courseId, this.videoId)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Exito!',
        text: 'Reunión actualizada exitosamente',
        confirmButtonText: 'cerrar',
      });
      this.dialogRef.close();
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

}
