import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkLoader } from './bulk-loader';

describe('BulkLoader', () => {
  let component: BulkLoader;
  let fixture: ComponentFixture<BulkLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
