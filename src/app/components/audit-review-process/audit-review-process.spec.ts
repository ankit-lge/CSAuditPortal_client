import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReviewProcess } from './audit-review-process';

describe('AuditReviewProcess', () => {
  let component: AuditReviewProcess;
  let fixture: ComponentFixture<AuditReviewProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditReviewProcess],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditReviewProcess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
