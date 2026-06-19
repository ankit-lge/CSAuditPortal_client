import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditMonitoringDashboard } from './audit-monitoring-dashboard';
import { ReactiveFormsModule } from '@angular/forms';

describe('AuditMonitoringDashboard', () => {
  let component: AuditMonitoringDashboard;
  let fixture: ComponentFixture<AuditMonitoringDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditMonitoringDashboard],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditMonitoringDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
