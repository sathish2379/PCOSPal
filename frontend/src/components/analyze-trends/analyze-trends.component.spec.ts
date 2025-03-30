import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeTrendsComponent } from './analyze-trends.component';

describe('AnalyzeTrendsComponent', () => {
  let component: AnalyzeTrendsComponent;
  let fixture: ComponentFixture<AnalyzeTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyzeTrendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzeTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
