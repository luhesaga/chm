import { TestBed } from '@angular/core/testing';

import { MeetsService } from './meets.service';

describe('MeetsService', () => {
  let service: MeetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
