import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CourseService } from '../../../../core/services/courses/course.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { UsersService } from '../../../../core/services/users/users.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, AfterViewInit {
  @ViewChild('myinput') myInputField: ElementRef;
  cat;
  form: FormGroup;
  fsId;
  id: string;
  percentageProgressBar = 0;
  showProgressBar = false;
  images: any = [];
  categories: any = [];
  types: string[] = ['Certificacion', 'Asistencia', 'Aprobacion'];
  teachers: any = [];

  //datos para editar curso
  imageName: string;
  imgUrl;
  confirmDelImg;
  changeImg = false;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private catService: CategoryService,
    private userService: UsersService,
    private fs: AngularFireStorage,
    private activatedRoute: ActivatedRoute,
    private fireStore: AngularFirestore,
    private route: Router
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.buildForm();
  }

  ngOnInit(): void {
    if (this.id) {
      this.getCourse();
    }
    this.listCategories();
    this.listTeachers();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.myInputField.nativeElement.focus();
    }, 100);
  }

  getCourse() {
    let cursos = this.courseService
      .detailCourse(this.id)
      .valueChanges()
      .subscribe((curso) => {
        console.log(curso);
        this.fsId = this.id;
        this.confirmDelImg = curso.nombreImg;
        this.imageField.setValue(curso.imagen);
        this.imageName = curso.nombreImg;
        this.nameField.setValue(curso.nombre);
        this.initialsField.setValue(curso.sigla);
        this.categoriaField.setValue(curso.categoria);
        this.tipoCertField.setValue(curso.tipoCerticado);
        this.profesorField.setValue(curso.profesor);
        this.durationField.setValue(curso.duracionCurso);
        this.percentageField.setValue(curso.porcentaje);
        cursos.unsubscribe();
      });
    // console.log(this.selectedCategory);
  }

  listCategories() {
    let categorias = this.catService
      .listCategories()
      .valueChanges()
      .subscribe((cat: any) => {
        this.categories = [];
        cat.forEach((element) => {
          const category = {
            id: element.id,
            nombre: element.nombre,
            activo: element.activo,
          };
          if (category.activo) {
            this.categories.push(category);
          }
        });
        categorias.unsubscribe();
      });
  }

  listTeachers() {
    let profesores = this.userService
      .listTeachers()
      .valueChanges()
      .subscribe((teachers: any) => {
        this.teachers = [];
        teachers.forEach((element) => {
          const teacher = {
            id: element.id,
            profesor: element.nombres + ' ' + element.apellidos,
          };
          this.teachers.push(teacher);
        });
        profesores.unsubscribe();
      });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      initials: ['', Validators.required],
      tipoCert: ['', Validators.required],
      image: ['', Validators.required],
      categoria: [''],
      profesor: [''],
      duration: [0, Validators.required],
      percentage: [0, Validators.required],
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get initialsField() {
    return this.form.get('initials');
  }

  get tipoCertField() {
    return this.form.get('tipoCert');
  }

  get imageField() {
    return this.form.get('image');
  }

  get categoriaField() {
    return this.form.get('categoria');
  }

  get profesorField() {
    return this.form.get('profesor');
  }

  get durationField() {
    return this.form.get('duration');
  }

  get percentageField() {
    return this.form.get('percentage');
  }

  cancel() {
    if (this.changeImg) {
      // borrar imagen cargada si cancela
      this.fs.ref(`cursos/${this.fsId}/${this.imageName}`).delete();
    } else {
      if (this.images.length > 0) {
        this.deleteImage(this.imageName);
      }
    }
    this.route.navigate(['dashboard/cursos']);
  }

  saveOrEditCourse(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.id) {
        this.saveCourse();
      } else {
        this.editCourse();
      }
    }
  }

  editCourse() {
    const data = this.form.value;
    const imageName = this.imageName;
    this.deleteImage(imageName);
    this.courseService
      .editCourse(data, this.id, imageName)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Curso actualizado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.route.navigate(['dashboard/cursos']);
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

  saveCourse() {
    const data = this.form.value;
    const imageName = this.images[0];
    this.courseService
      .createCourse(data, this.fsId, imageName)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Curso agregado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.route.navigate(['dashboard/cursos']);
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

  uploadImage(event) {
    if (this.id) {
      this.editImage(event);
    } else {
      this.uploadNewImage(event);
    }
  }

  uploadNewImage(event) {
    this.fsId = this.fireStore.createId();
    this.showProgressBar = true;
    const image = event.target.files[0] as File;
    const name = image.name;
    const fileRef = this.fs.ref(`cursos/${this.fsId}/${name}`);
    const path = `cursos/${this.fsId}/${image.name}`;
    const task = this.fs.upload(path, image);

    task
      .percentageChanges()
      .pipe(map(Math.ceil))
      .pipe(
        finalize(() => {
          const urlImage = fileRef.getDownloadURL();
          urlImage.subscribe((url) => {
            this.imageField.setValue(url);
            // borrar imagen previamente cargada
            if (this.images.length > 0) {
              this.deleteImage(image.name);
              this.images.length = 0;
            }
            this.images.push(name);
            this.imageName = image.name;
          });
          this.showProgressBar = false;
        })
      )
      .subscribe((per) => {
        this.percentageProgressBar = per;
        //console.log(per);
      });
  }

  editImage(event) {
    this.showProgressBar = true;
    const image = event.target.files[0] as File;
    const name = image.name;
    const fileRef = this.fs.ref(`cursos/${this.fsId}/${name}`);
    const path = `cursos/${this.fsId}/${image.name}`;
    const task = this.fs.upload(path, image);

    task
      .percentageChanges()
      .pipe(map(Math.ceil))
      .pipe(
        finalize(() => {
          const urlImage = fileRef.getDownloadURL();
          urlImage.subscribe((url) => {
            this.imageField.setValue(url);
            this.imageName = image.name;
            this.changeImg = true;
          });
          this.showProgressBar = false;
        })
      )
      .subscribe((per) => {
        this.percentageProgressBar = per;
        //console.log(per);
      });
  }

  deleteImage(imgName) {
    let url;
    if (this.id) {
      if (this.confirmDelImg !== imgName) {
        url = this.confirmDelImg;
        this.fs.ref(`cursos/${this.fsId}/${url}`).delete();
      }
    } else {
      url = this.images[0];
      this.fs.ref(`cursos/${this.fsId}/${url}`).delete();
    }
  }
}
