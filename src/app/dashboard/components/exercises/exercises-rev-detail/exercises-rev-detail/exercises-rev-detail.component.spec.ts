import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesRevDetailComponent } from './exercises-rev-detail.component';

describe('ExercisesRevDetailComponent', () => {
  let component: ExercisesRevDetailComponent;
  let fixture: ComponentFixture<ExercisesRevDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesRevDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesRevDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
