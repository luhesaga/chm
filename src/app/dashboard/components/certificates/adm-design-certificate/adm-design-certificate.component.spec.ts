import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDesignCertificateComponent } from './adm-design-certificate.component';

describe('AdmDesignCertificateComponent', () => {
  let component: AdmDesignCertificateComponent;
  let fixture: ComponentFixture<AdmDesignCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmDesignCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDesignCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
