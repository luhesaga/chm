import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { MatDialog } from '@angular/material/dialog';
import { CourseDescriptionComponent } from './course-description/course-description.component';
import { Router } from '@angular/router';
import { CreateComponent } from './create/create.component';



@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private courseService: CourseService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseService
      .listCourses()
      .valueChanges()
      .subscribe(courses => (this.dataSource.data = courses));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(data): void {
    const config = {
      data: {
        message: data ? 'Editar curso' : 'Agregar nuevo cursos',
        content: data
      }
    };

    const dialogRef = this.dialog.open(CourseDescriptionComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

  goToDetail(id) {
    this.router.navigate([`/cursos/detail/view${id}`]);
  }

  goToEdit(data) {
    this.router.navigate([`/cursos/course-edit/${data.id}`]);
  }

}
