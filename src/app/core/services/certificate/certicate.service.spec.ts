import { TestBed } from '@angular/core/testing';

import { CerticateService } from './certicate.service';

describe('CerticateService', () => {
  let service: CerticateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CerticateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
