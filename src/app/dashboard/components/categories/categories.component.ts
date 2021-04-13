import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../core/services/categories/category.service';
import { CourseService } from '../../../core/services/courses/course.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'codigo', 'activo', 'cursos', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private catService: CategoryService,
    private courseService: CourseService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.catService
      .listCategories()
      .valueChanges()
      .subscribe(categories => {
        categories.forEach(cat => {
          // console.log(cat);
          this.courseService.coursesByCategory(cat.id).valueChanges()
            .subscribe(cursos => {
              // console.log(cursos.length);
              cat.cursos = cursos.length;
              // console.log(cat);
            })
        })
        this.dataSource.data = categories;
        console.log(categories);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToEdit(data) {
    this.router.navigate([`/categorias/edit/${data.id}`]);
  }

  deleteCategory(id) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción eliminara esta categoria permanentemente, no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro!'
    })
    .then((result) => {
      if (result.value) {
        this.catService.deleteCategory(id)
          .then(() => {
            this.courseService.coursesByCategory(id).valueChanges()
              .subscribe(courses => {
                courses.forEach(c => {
                  this.courseService.deleteCategory(c.id);
                })
              });
            Swal.fire(
              'Eliminado!',
              'Eliminación exitosa.',
              'success',
            );
        })
        .catch((error) => {
          Swal.fire(
            'Error!',
            `La operación no se pudó realizar, ${error}.`,
            'error',
          );
        });
      }
    })
    .catch(error => console.log(error));
  }

  checkActive(event: Event) {
    event.preventDefault();
  }

}
