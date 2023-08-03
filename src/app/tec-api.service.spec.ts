import { TestBed } from '@angular/core/testing';

import { TecApiService } from './tec-api.service';

describe('TecApiService', () => {
  let service: TecApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TecApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
