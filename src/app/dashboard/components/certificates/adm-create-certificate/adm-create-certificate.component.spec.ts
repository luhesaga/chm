import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCreateCertificateComponent } from './adm-create-certificate.component';

describe('AdmCreateCertificateComponent', () => {
  let component: AdmCreateCertificateComponent;
  let fixture: ComponentFixture<AdmCreateCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmCreateCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmCreateCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
