import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditClaimUpload } from './audit-claim-upload';

describe('AuditClaimUpload', () => {
  let component: AuditClaimUpload;
  let fixture: ComponentFixture<AuditClaimUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditClaimUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditClaimUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
