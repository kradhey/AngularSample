import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { environment } from 'environments/environment';

@Component({
    selector: 'ij-profile-gear',
    templateUrl: './profile-gear.component.html',
    styleUrls: ['../styles/common.less']
})
export class ProfileGearComponent extends BaseProfileComponent {
    gearUrl: string;

    constructor (
        route: ActivatedRoute,
        router: Router
    ) {
        super(route, router);
    }

    onProfileChanged() {
        super.onProfileChanged();
        this.setGearUrl();
    }

    private setGearUrl() {
        const url = environment.site.pdfUrl(this.model.gearFileName);
        this.gearUrl = this.getPdfViewerUrl(url);
    }
}