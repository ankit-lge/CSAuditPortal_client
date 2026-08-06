import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItLayout } from './it-layout';

describe('ItLayout', () => {
  let component: ItLayout;
  let fixture: ComponentFixture<ItLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ItLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
