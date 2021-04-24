import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonContentListComponent } from './lesson-content-list.component';

describe('LessonContentListComponent', () => {
  let component: LessonContentListComponent;
  let fixture: ComponentFixture<LessonContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonContentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
