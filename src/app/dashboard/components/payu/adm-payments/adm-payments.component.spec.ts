import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPaymentsComponent } from './adm-payments.component';

describe('AdmPaymentsComponent', () => {
  let component: AdmPaymentsComponent;
  let fixture: ComponentFixture<AdmPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
