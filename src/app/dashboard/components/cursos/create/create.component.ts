import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../../core/services/courses/course.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

	form: FormGroup;
	fsId;
	id: string;
	percentageProgressBar = 0;
	showProgressBar = false;
	filename: string;
	images: any = [];

constructor(
	private formBuilder: FormBuilder,
	private courseService: CourseService,
    private fs: AngularFireStorage,
	private activatedRoute: ActivatedRoute,
	private fireStore: AngularFirestore,
	private route: Router
) {
	this.id = this.activatedRoute.snapshot.params.idCategory
	this.buildForm()
}

ngOnInit(): void {
}

private buildForm(): void {
	this.form = this.formBuilder.group({
		name: ['', Validators.required,],
		image: ['', Validators.required],
		introduction: [''],
		objetive: [''],
		description: ['']
	})
}

get nameField() {
	return this.form.get('name');
}

get imageField() {
	return this.form.get('image');
}

get introductionField() {
	return this.form.get('introduction');
}

get objetiveField() {
	return this.form.get('objetive');
}

get descriptionField() {
	return this.form.get('description');
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

editCourse() {}

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
				text: 'Ocurrio un error' + error,
				confirmButtonText: 'cerrar',
            });
        });
}

uploadImage(event) {
	if (!this.fsId) {
		this.fsId = this.fireStore.createId();
	}
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
					this.deleteImage();
					this.images.length = 0;
				}
				this.images.push(name);
				this.filename = image.name;
			})
				this.showProgressBar = false;
			}))
			.subscribe(per => {
				this.percentageProgressBar = per;
				console.log(per);
			})
}

deleteImage() {
	const url = this.images[0];
	this.fs.ref(`cursos/${url}`).delete();
}

}
