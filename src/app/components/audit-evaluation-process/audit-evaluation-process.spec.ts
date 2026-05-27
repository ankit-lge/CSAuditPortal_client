import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEvaluationProcess } from './audit-evaluation-process';

describe('AuditEvaluationProcess', () => {
  let component: AuditEvaluationProcess;
  let fixture: ComponentFixture<AuditEvaluationProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditEvaluationProcess],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditEvaluationProcess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
