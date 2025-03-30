import { TestBed } from '@angular/core/testing';

import { PeriodCycleLoggerService } from './period-cycle-logger.service';

describe('PeriodCycleLoggerService', () => {
  let service: PeriodCycleLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodCycleLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
