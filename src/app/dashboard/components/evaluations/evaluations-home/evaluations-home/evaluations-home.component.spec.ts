import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsHomeComponent } from './evaluations-home.component';

describe('EvaluationsHomeComponent', () => {
  let component: EvaluationsHomeComponent;
  let fixture: ComponentFixture<EvaluationsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
