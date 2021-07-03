import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { GlossaryListComponent } from '../glossary-list/glossary-list.component';
import Swal from 'sweetalert2';
import { GlossaryService } from '../../../../core/services/glossary/glossary.service';

@Component({
  selector: 'app-glossary-create',
  templateUrl: './glossary-create.component.html',
  styleUrls: ['./glossary-create.component.scss']
})
export class GlossaryCreateComponent implements OnInit {

  private editorSubject: Subject<any> = new AsyncSubject();

  form: FormGroup;

  edit = false;

  courseId;
  termId;
  terminus;
  def;

  constructor(
    public dialog: MatDialogRef<GlossaryListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editDialog: MatDialog,
    private formBuilder: FormBuilder,
    private glossaryService: GlossaryService,
  ) { this.buildForm(); }

  ngOnInit(): void {
    this.verifyDataContent();
  }

  verifyDataContent() {
    // editar termino?
    if (this.data.content.action === 'edit') {
      this.edit = true;
      this.termId = this.data.content.id;
      this.terminus = this.data.content.termino;
      this.def = this.data.content.definicion;
    }

    this.courseId = this.data.content.courseId;
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      term: ['', Validators.required,],
      definition: ['', Validators.required],
    })
  }

  get termField() {
    return this.form.get('term');
  }

  get definitionField() {
    return this.form.get('definition');
  }

  saveOrEditTerm(event: Event) {
    // console.log(event);
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.edit) {
        this.saveTerm();
      } else {
        this.editTerm();
      }
    }
  }

  editTerm() {
    this.glossaryService.editTerm(this.form.value, this.courseId, this.termId)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Exito!',
        text: 'Término actualizado exitosamente',
        confirmButtonText: 'cerrar',
      });
      this.dialog.close();
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

  saveTerm() {
    this.glossaryService.createTerm(this.form.value, this.courseId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Término creado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.dialog.close();
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
