import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject, Subject } from 'rxjs';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-lesson-config',
  templateUrl: './lesson-config.component.html',
  styleUrls: ['./lesson-config.component.scss']
})
export class LessonConfigComponent implements OnInit, OnDestroy {
  // datos recibidos componente lesson-list
  courseId: string;
  lessonId: string;
  contentId: string;

  edit = false;
  noContenidos: number;

  titulo;
  contenido;
  archivo;
  foro;

  private editorSubject: Subject<any> = new AsyncSubject();

  form: FormGroup;

  contentReceived;
  content;

  contentOption: string;
  bkContentOption: string;
  options: string[] = ['Agregar contenido', 'Agregar archivo PDF', 'Agregar foro'];

  // para cargar el PDF
  percentageProgressBar = 0;
	showProgressBar = false;
	archives: any = [];
  fsId;
  changePDF;
  confirmDelPDF;
  public url = new URL('http://pdfviewer.net/assets/pdfs/GraalVM.pdf')


  @ViewChild('tabGroup') tabGroup;


  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private lessonService: LessonsService,
    private fs: AngularFireStorage,
    private fireStore: AngularFirestore,
  ) {
    this.courseId = this.activatedRoute.snapshot.params.cid;
    this.lessonId = this.activatedRoute.snapshot.params.lid;
    this.contentId = this.activatedRoute.snapshot.params.contentId;
    if (this.contentId === 'new') {
      this.edit = false;
    } else {
      this.edit = true;
    }
    //console.log(`id curso: ${this.courseId}, id lección: ${this.lessonId}, id contenido: ${this.contentId}`);

    this.buildForm()
  }

  ngOnInit(): void {
    if (this.edit) {
      this.contentReceived = this.lessonService.lessonContentDetail(
        this.courseId,
        this.lessonId,
        this.contentId
        )
        .valueChanges()
        .subscribe((content: any) => {
          //console.log(content);
          this.content = content;
          this.titulo = content.titulo;
          this.contenido = content.contenido;
          this.archivo = content.nombreArchivo;
          this.confirmDelPDF = content.nombreArchivo;
          this.archivoField.setValue(content.archivo);
          this.foro = content.foro;
          this.fsId = content.id;
          console.log(this.fsId);
          console.log(this.contentId);
          switch (content.tipo) {
            case 'Agregar contenido':
              this.contentOption = 'Agregar contenido';
              break;
            case 'Agregar archivo PDF':
              this.contentOption = 'Agregar archivo PDF';
              break;
            case 'Agregar foro':
              this.contentOption = 'Agregar foro';
              break;
          }
          //console.log(content);
        })
    } else {
      this.contentReceived = this.lessonService.listLessonContent(this.courseId, this.lessonId)
        .valueChanges()
        .subscribe(c => {
          this.noContenidos = c.length;
          //console.log(this.noContenidos);
          // console.log(c);
        })
      this.fsId = this.fireStore.createId();
      //console.log(this.fsId);
    }
  }

  ngOnDestroy() {
    this.contentReceived.unsubscribe();
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required,],
      tipo: [''],
      contenido: [''],
      archivo: [''],
      foro: [''],
    })
  }

  get tituloField() {
    return this.form.get('titulo');
  }

  get tipoField() {
    return this.form.get('tipo');
  }

  get contenidoField() {
    return this.form.get('contenido');
  }

  get archivoField() {
    return this.form.get('archivo');
  }

  get foroField() {
    return this.form.get('foro');
  }

  cancel() {
    if (this.changePDF) {
      // borrar PDF cargado si cancela
      this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${this.archivo}`).delete();
    }
    this.route.navigate([`cursos/${this.courseId}/lecciones/content-list/${this.lessonId}`]);
  }

  onSubmit(event: Event){
    //console.log(this.form.value);
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //this.form.disable();
      this.validateContent();
      // console.log(this.form.value)
      if (this.edit) {
        this.updateContent();
      } else {
        this.createContent();
      }
    }
  }

  validateContent() {
    if (this.contentOption === 'Agregar contenido') {
      if (this.contenido) {
        this.archivoField.setValue(null);
        if (this.archivo) {
          this.archivo = null;
          this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${this.archivo}`).delete();
        }
        this.archivo = null;
        this.foroField.setValue(null);
      } else {
        if (this.archivo) {
          this.tipoField.setValue('Agregar archivo PDF');
        }
        if (this.foro) {
          this.tipoField.setValue('Agregar foro');
        }
      }
    } else if (this.contentOption === 'Agregar archivo PDF') {
      if (this.archivo) {
        this.contenidoField.setValue(null);
        this.foroField.setValue(null);
      } else {
        if (this.contenido) {
          this.tipoField.setValue('Agregar contenido');
        }
        if (this.foro) {
          this.tipoField.setValue('Agregar foro');
        }
      }
    } else {
      if (this.foro) {
        this.contenidoField.setValue(null);
        this.archivoField.setValue(null);
        if (this.archivo) {
          this.archivo = null;
          this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${this.archivo}`).delete();
        }
        this.archivo = null;
      } else {
        if (this.archivo) {
          this.tipoField.setValue('Agregar archivo PDF');
        }
        if (this.contenido) {
          this.tipoField.setValue('Agregar contenido');
        }
      }
    }
  }

  createContent() {
    this.form.value.posicion = this.noContenidos + 1;
    this.lessonService.addLessonContent(
      this.form.value,
      this.courseId,
      this.lessonId,
      this.archivo,
      this.fsId
    )
    .then(() => {
			Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'contenido creado exitosamente',
				confirmButtonText: 'cerrar',
			});
			this.route.navigate([`cursos/${this.courseId}/lecciones/content-list/${this.lessonId}`]);
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

  updateContent() {
    //console.log(this.form.value);
    if (this.contentOption === 'Agregar archivo PDF') {
      this.deletePDF(this.archivo);
    }
    this.lessonService.editLessonContent(
      this.form.value,
      this.courseId,
      this.lessonId,
      this.fsId,
      this.archivo
    )
    .then(() => {
			Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'contenido actualizado exitosamente',
				confirmButtonText: 'cerrar',
			});
			this.route.navigate([`cursos/${this.courseId}/lecciones/content-list/${this.lessonId}`]);
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

  uploadPDF(event) {
    if (this.edit) {
      this.editPDF(event);
    } else {
      this.uploadNewPDF(event);
    }
  }

  uploadNewPDF(event) {

    this.showProgressBar = true
    const file = event.target.files[0] as File;
    const name = file.name;
    const fileRef = this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${name}`);
    const path = `cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${file.name}`;
    const task = this.fs.upload(path, file);

    task.percentageChanges()
      .pipe(map(Math.ceil))
      .pipe(finalize(() => {
        const urlFile = fileRef.getDownloadURL()
        urlFile.subscribe(url => {
          this.archivoField.setValue(url);
          //console.log(this.archivoField);
          // borrar imagen previamente cargada
          if (this.archives.length > 0) {
            this.deletePDF(file.name);
            this.archives.length = 0;
          }
          this.archives.push(name);
          this.archivo = file.name;
        })
          this.showProgressBar = false;
        }))
        .subscribe(per => {
          this.percentageProgressBar = per;
          //console.log(per);
        })
  }

  editPDF(event) {
    this.showProgressBar = true
    const file = event.target.files[0] as File;
    const name = file.name;
    const fileRef = this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${name}`);
    const path = `cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${file.name}`;
    const task = this.fs.upload(path, file);

    task.percentageChanges()
      .pipe(map(Math.ceil))
      .pipe(finalize(() => {
        const urlFile = fileRef.getDownloadURL()
        urlFile.subscribe(url => {
          this.archivoField.setValue(url);
          this.archivo = file.name;
          this.changePDF = true;
        })
          this.showProgressBar = false;
        }))
        .subscribe(per => {
          this.percentageProgressBar = per;
          //console.log(per);
        })
  }

  deletePDF(PDFName) {
    let url;
    //console.log(`pdfname: ${PDFName}, this.confirmdelpdf: ${this.confirmDelPDF}`)
    if (this.edit) {
      if (this.confirmDelPDF !== PDFName && this.confirmDelPDF !== null) {
        url = this.confirmDelPDF;
        this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${url}`).delete();
      }
    } else {
      url = this.archives[0];
      this.fs.ref(`cursos/${this.courseId}/lecciones/${this.lessonId}/contenidos/${this.fsId}/${url}`).delete();
    }
  }

}
