import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAuthorise } from './un-authorise';

describe('UnAuthorise', () => {
  let component: UnAuthorise;
  let fixture: ComponentFixture<UnAuthorise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnAuthorise],
    }).compileComponents();

    fixture = TestBed.createComponent(UnAuthorise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
