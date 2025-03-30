import { TestBed } from '@angular/core/testing';

import { AnalyzeTrendsService } from './analyze-trends.service';

describe('AnalyzeTrendsService', () => {
  let service: AnalyzeTrendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyzeTrendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
