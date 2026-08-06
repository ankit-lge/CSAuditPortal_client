import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAuditTemplate } from './manage-audit-template';

describe('ManageAuditTemplate', () => {
  let component: ManageAuditTemplate;
  let fixture: ComponentFixture<ManageAuditTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAuditTemplate],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAuditTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
