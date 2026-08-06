import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTemplateLook } from './audit-template-look';

describe('AuditTemplateLook', () => {
  let component: AuditTemplateLook;
  let fixture: ComponentFixture<AuditTemplateLook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditTemplateLook],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditTemplateLook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
