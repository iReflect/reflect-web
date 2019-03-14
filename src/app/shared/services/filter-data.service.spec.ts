import { TestBed, inject } from '@angular/core/testing';

import { FilterDataService } from './filter-data.service';

describe('FilterDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterDataService]
    });
  });

  it('should be created', inject([FilterDataService], (service: FilterDataService) => {
    expect(service).toBeTruthy();
  }));
});
