import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatusReport } from './feedback-status-report';

describe('FeedbackStatusReport', () => {
  let component: FeedbackStatusReport;
  let fixture: ComponentFixture<FeedbackStatusReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackStatusReport],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackStatusReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
