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
            'feedback_icon',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/feedback_icon.svg')
        );
        iconRegistry.addSvgIcon(
            'team_feedback_icon',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/team_feedback_icon.svg')
        );
    }
}
