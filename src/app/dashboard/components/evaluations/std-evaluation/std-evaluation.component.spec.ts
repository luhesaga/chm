import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdEvaluationComponent } from './std-evaluation.component';

describe('StdEvaluationComponent', () => {
  let component: StdEvaluationComponent;
  let fixture: ComponentFixture<StdEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StdEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StdEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
