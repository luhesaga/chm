import { TestBed } from '@angular/core/testing';

import { GlossaryService } from './glossary.service';

describe('GlossaryService', () => {
  let service: GlossaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlossaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
