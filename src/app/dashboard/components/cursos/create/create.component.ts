import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CourseService } from '../../../../core/services/courses/course.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { UsersService } from '../../../../core/services/users/users.service';
@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, AfterViewInit {

	@ViewChild("myinput") myInputField: ElementRef;
	cat;
	form: FormGroup;
	fsId;
	id: string;
	percentageProgressBar = 0;
	showProgressBar = false;
	images: any = [];
	categories: any = [];
	selectedCategory: string;
	teachers: any = [];
	selectedTeacher: string;

	//datos para editar curso
	imageName: string;
	name: string;
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
	this.id = this.activatedRoute.snapshot.params.id
	this.buildForm()
}

ngOnInit(): void {
	if (this.id) {
		this.getCourse();
	}
	this.listCategories();
	this.listTeachers();
}

ngAfterViewInit() {
	this.myInputField.nativeElement.focus();
}

getCourse() {
	this.courseService.detailCourse(this.id).valueChanges()
		.subscribe(curso => {
			// console.log(curso);
			this.fsId = this.id;
			this.confirmDelImg = curso.nombreImg;
			this.imageField.setValue(curso.imagen);
			this.imageName = curso.nombreImg;
			this.name = curso.nombre;
			this.selectedCategory = curso.categoria;
			console.log(this.selectedCategory);
			// console.log(this.selectedCategory);
			this.selectedTeacher = curso.profesor;
			// console.log(this.selectedTeacher);
		});
	console.log(this.selectedCategory);
}

listCategories() {
	this.catService.listCategories().valueChanges()
		.subscribe((cat: any) => {
			this.categories = [];
			cat.forEach(element => {
				const category = {
					id: element.id,
					nombre: element.nombre,
					activo: element.activo
				}
				console.log(category);
				if (category.activo) {
					console.log('hpta');
					this.categories.push(category);
				}
			});
		});
}

listTeachers() {
	this.userService.listTeachers().valueChanges()
		.subscribe((teachers: any) => {
			teachers.forEach(element => {
				this.teachers = [];
				const teacher = {
					id: element.id,
					profesor: element.nombres + ' ' + element.apellidos,
				}
				this.teachers.push(teacher);
			})
		});
}

private buildForm(): void {
	this.form = this.formBuilder.group({
		name: ['', Validators.required,],
		image: ['', Validators.required],
		categoria: [''],
		profesor: [''],
	})
}

get nameField() {
	return this.form.get('name');
}

get imageField() {
	return this.form.get('image');
}

get categoriaField() {
	return this.form.get('introduction');
}

get profesorField() {
	return this.form.get('objetive');
}

cancel() {
	if (this.changeImg) {
		// borrar imagen cargada si cancela
		this.fs.ref(`cursos/${this.fsId}/${this.imageName}`).delete();
	}
	this.route.navigate(['dashboard/cursos']);
}

saveOrEditCourse(event: Event) {
	event.preventDefault();
	this.form.markAllAsTouched();
	if (this.form.valid) {
		this.form.disable();
		if (!this.id) {
			this.saveCourse()
		} else {
			this.editCourse()
		}
	}
}

editCourse() {
	const data = this.form.value;
	const imageName = this.imageName;
	this.deleteImage(imageName);
	this.courseService.editCourse(data, this.id, imageName)
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
	this.courseService.createCourse(data, this.fsId, imageName)
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
	this.showProgressBar = true
	const image = event.target.files[0] as File;
    const name = image.name;
    const fileRef = this.fs.ref(`cursos/${this.fsId}/${name}`);
	const path = `cursos/${this.fsId}/${image.name}`
	const task = this.fs.upload(path, image);

	task.percentageChanges()
		.pipe(map(Math.ceil))
		.pipe(finalize(() => {
			const urlImage = fileRef.getDownloadURL()
			urlImage.subscribe(url => {
				this.imageField.setValue(url);
				// borrar imagen previamente cargada
				if (this.images.length > 0) {
					this.deleteImage(image.name);
					this.images.length = 0;
				}
				this.images.push(name);
				this.imageName = image.name;
			})
				this.showProgressBar = false;
			}))
			.subscribe(per => {
				this.percentageProgressBar = per;
				//console.log(per);
			})
}

editImage(event) {
	this.showProgressBar = true
	const image = event.target.files[0] as File;
    const name = image.name;
    const fileRef = this.fs.ref(`cursos/${this.fsId}/${name}`);
	const path = `cursos/${this.fsId}/${image.name}`
	const task = this.fs.upload(path, image);

	task.percentageChanges()
		.pipe(map(Math.ceil))
		.pipe(finalize(() => {
			const urlImage = fileRef.getDownloadURL()
			urlImage.subscribe(url => {
				this.imageField.setValue(url);
				this.imageName = image.name;
				this.changeImg = true;
			})
				this.showProgressBar = false;
			}))
			.subscribe(per => {
				this.percentageProgressBar = per;
				//console.log(per);
			})
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
