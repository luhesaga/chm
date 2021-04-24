import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonConfigComponent } from './lesson-config.component';

describe('LessonConfigComponent', () => {
  let component: LessonConfigComponent;
  let fixture: ComponentFixture<LessonConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
