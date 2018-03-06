import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent {
    hide = true;

    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'feedback-icon',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/feedback-icon.svg')
        );
        iconRegistry.addSvgIcon(
            'team-feedback-icon',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/team-feedback-icon.svg')
        );
    }
}
