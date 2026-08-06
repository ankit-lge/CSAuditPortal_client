import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTypeLookup } from './audit-type-lookup';

describe('AuditTypeLookup', () => {
  let component: AuditTypeLookup;
  let fixture: ComponentFixture<AuditTypeLookup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditTypeLookup],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditTypeLookup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
