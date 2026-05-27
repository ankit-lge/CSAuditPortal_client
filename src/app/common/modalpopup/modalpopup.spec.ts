import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalpopup } from './modalpopup';

describe('Modalpopup', () => {
  let component: Modalpopup;
  let fixture: ComponentFixture<Modalpopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Modalpopup],
    }).compileComponents();

    fixture = TestBed.createComponent(Modalpopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
