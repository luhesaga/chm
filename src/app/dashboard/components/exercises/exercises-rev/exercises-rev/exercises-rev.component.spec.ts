import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesRevComponent } from './exercises-rev.component';

describe('ExercisesRevComponent', () => {
  let component: ExercisesRevComponent;
  let fixture: ComponentFixture<ExercisesRevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesRevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
