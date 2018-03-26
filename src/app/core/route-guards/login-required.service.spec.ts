import { inject, TestBed } from '@angular/core/testing';

import { LoginRequiredGuard } from './login-required.service';

describe('LoginRequiredService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoginRequiredGuard]
        });
    });

    xit('should be created', inject([LoginRequiredGuard], (service: LoginRequiredGuard) => {
        expect(service).toBeTruthy();
    }));
});
