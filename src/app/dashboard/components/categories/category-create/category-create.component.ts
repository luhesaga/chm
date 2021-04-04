import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/categories/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

  form: FormGroup;
	id: string;
  codigo: string;
  nombre: string;

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.buildForm()
  }

  ngOnInit(): void {
    if (this.id) {
      this.getCategory(this.id);
    }
  }

  getCategory(id) {
    this.catService.detailCategory(id).valueChanges()
      .subscribe(cat => {
        // console.log(cat)
        this.codigo = cat.codigo;
        this.nombre = cat.nombre;
      })
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', Validators.required,],
    })
  }

  get codeField() {
    return this.form.get('code');
  }

  get nameField() {
    return this.form.get('name');
  }

  saveOrEditCategory(event: Event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      if (!this.id) {
        this.saveCategory()
      } else {
        this.editCategory()
      }
    }
  }

  editCategory() {
    const data = this.form.value;
    console.log(data);
    this.catService.editCategory(data, this.id)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Categoria actualizada exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.route.navigate(['dashboard/categorias']);
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

  saveCategory() {
    const data = this.form.value;
    this.catService.createCategory(data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Categoria agregada exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.route.navigate(['dashboard/categorias']);
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

}
