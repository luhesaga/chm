import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationFinishComponent } from './evaluation-finish.component';

describe('EvaluationFinishComponent', () => {
  let component: EvaluationFinishComponent;
  let fixture: ComponentFixture<EvaluationFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationFinishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
