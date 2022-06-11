import { TestBed } from '@angular/core/testing';

import { PayuService } from './payu.service';

describe('PayuService', () => {
  let service: PayuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
