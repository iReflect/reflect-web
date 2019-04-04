import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';

describe('FilterDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService]
    });
  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));
});
