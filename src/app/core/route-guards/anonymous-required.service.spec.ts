import { inject, TestBed } from '@angular/core/testing';

import { AnonymousRequiredGuard } from './anonymous-required.service';

describe('AnonymousRequiredService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AnonymousRequiredGuard]
        });
    });

    xit('should be created', inject([AnonymousRequiredGuard], (service: AnonymousRequiredGuard) => {
        expect(service).toBeTruthy();
    }));
});
