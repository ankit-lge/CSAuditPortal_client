import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditMonitoringDAshboard } from './audit-monitoring-dashboard';

describe('AuditMonitoringDAshboard', () => {
  let component: AuditMonitoringDAshboard;
  let fixture: ComponentFixture<AuditMonitoringDAshboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditMonitoringDAshboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditMonitoringDAshboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
