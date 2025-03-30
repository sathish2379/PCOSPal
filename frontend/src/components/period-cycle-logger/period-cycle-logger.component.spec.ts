import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodCycleLoggerComponent } from './period-cycle-logger.component';

describe('PeriodCycleLoggerComponent', () => {
  let component: PeriodCycleLoggerComponent;
  let fixture: ComponentFixture<PeriodCycleLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodCycleLoggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodCycleLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
