import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { environment } from 'environments/environment';

@Component({
    selector: 'ij-profile-resume',
    templateUrl: 'profile-resume.component.html',
    styleUrls: ['../styles/common.less']
})
export class ProfileResumeComponent extends BaseProfileComponent {
    resumeUrl: string;

    constructor (
        route: ActivatedRoute,
        router: Router
    ) {
        super(route, router);
    }

    onProfileChanged() {
        super.onProfileChanged();
        this.setResumeUrl();
    }

    private setResumeUrl() {
        const url = environment.site.pdfUrl(this.model.resumeFileName);
        this.resumeUrl = this.getPdfViewerUrl(url);
    }
}