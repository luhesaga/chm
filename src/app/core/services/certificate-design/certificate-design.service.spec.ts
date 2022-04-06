import { TestBed } from '@angular/core/testing';

import { CertificateDesignService } from './certificate-design.service';

describe('CertificateDesignService', () => {
  let service: CertificateDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateDesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
