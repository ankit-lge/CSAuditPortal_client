import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatus } from './feedback-status';

describe('FeedbackStatus', () => {
  let component: FeedbackStatus;
  let fixture: ComponentFixture<FeedbackStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
