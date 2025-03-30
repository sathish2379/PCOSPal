import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomTrackerComponent } from './symptom-tracker.component';

describe('SymptomTrackerComponent', () => {
  let component: SymptomTrackerComponent;
  let fixture: ComponentFixture<SymptomTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
