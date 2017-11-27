import { TestBed, inject } from '@angular/core/testing';

import { UserDataStoreService } from './user-data-store.service';

describe('UserDataStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDataStoreService]
    });
  });

  it('should be created', inject([UserDataStoreService], (service: UserDataStoreService) => {
    expect(service).toBeTruthy();
  }));
});
