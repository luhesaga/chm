import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseInfoComponent } from './course-info/course-info.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  openDialog(data): void {
    const config = {
      data: {
        message: data ? 'Editar usuario' : 'Agregar nuevo usuario',
        content: data
      }
    };

    const dialogRef = this.dialog.open(CourseInfoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

}
