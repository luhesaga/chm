import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmListCertificatesComponent } from './adm-list-certificates.component';

describe('AdmListCertificatesComponent', () => {
  let component: AdmListCertificatesComponent;
  let fixture: ComponentFixture<AdmListCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmListCertificatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmListCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
