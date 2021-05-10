import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesCreateComponent } from './exercises-create.component';

describe('ExercisesCreateComponent', () => {
  let component: ExercisesCreateComponent;
  let fixture: ComponentFixture<ExercisesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
