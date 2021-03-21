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

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private activatedRoute: ActivatedRoute,
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
    })
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

  editCategory() {}

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
