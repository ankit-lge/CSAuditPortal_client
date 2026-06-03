import { TestBed } from '@angular/core/testing';

import { RouteLoaderService } from './route-loader';

describe('RouteLoader', () => {
  let service: RouteLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
