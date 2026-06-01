import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiLoader } from './api-loader';

describe('ApiLoader', () => {
  let component: ApiLoader;
  let fixture: ComponentFixture<ApiLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
