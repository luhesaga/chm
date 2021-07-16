import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService } from '../../../../core/services/courses/course.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  description;
  id;

  private editorSubject: Subject<any> = new AsyncSubject();

  public form = new FormGroup({
    body: new FormControl("", Validators.required)
  });

  constructor(
    public dialog: MatDialogRef<CourseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.description = this.data.content[this.data.content.type];
    this.id = this.data.content.id;
  }

  handleEditorInit(e) {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  onSubmit(){
    this.courseService.editCourseDescription(
      this.id,
      this.description,
      this.data.content.type)
        .then(res => {
          this.dialog.close(this.description);
        })
        .catch(error => {
          console.log(error);
        });
  }

}
