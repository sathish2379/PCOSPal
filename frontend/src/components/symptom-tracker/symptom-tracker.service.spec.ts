import { TestBed } from '@angular/core/testing';

import { SymptomTrackerService } from './symptom-tracker.service';

describe('SymptomTrackerService', () => {
  let service: SymptomTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SymptomTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
