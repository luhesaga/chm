import { TestBed } from '@angular/core/testing';

import { CareerCertService } from './career-cert.service';

describe('CareerCertService', () => {
  let service: CareerCertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerCertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
