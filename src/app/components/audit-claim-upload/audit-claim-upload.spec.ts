import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditClaimUpload } from './audit-claim-upload';
import { ReactiveFormsModule } from '@angular/forms';

describe('AuditClaimUpload', () => {
  let component: AuditClaimUpload;
  let fixture: ComponentFixture<AuditClaimUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditClaimUpload],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditClaimUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
