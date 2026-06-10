import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSummaryReport } from './audit-summary-report';

describe('AuditSummaryReport', () => {
  let component: AuditSummaryReport;
  let fixture: ComponentFixture<AuditSummaryReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditSummaryReport],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditSummaryReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
