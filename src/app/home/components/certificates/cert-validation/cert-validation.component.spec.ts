import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertValidationComponent } from './cert-validation.component';

describe('CertValidationComponent', () => {
  let component: CertValidationComponent;
  let fixture: ComponentFixture<CertValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
