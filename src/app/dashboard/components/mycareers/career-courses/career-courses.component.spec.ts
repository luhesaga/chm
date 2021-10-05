import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerCoursesComponent } from './career-courses.component';

describe('CareerCoursesComponent', () => {
  let component: CareerCoursesComponent;
  let fixture: ComponentFixture<CareerCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
