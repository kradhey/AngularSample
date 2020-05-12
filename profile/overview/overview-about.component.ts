import { Component, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { environment } from 'environments/environment';
import * as organizationSlider from '../../shared/view/organizationslider';
@Component({
    selector: 'ij-profile-overview-about',
    templateUrl: './overview-about.component.html',
    styleUrls: ['./styles/about.less']
})
export class ProfileOverviewAboutComponent extends BaseProfileComponent {
    public el:ElementRef;
    metaUrl: string = null;
    loginCompany: boolean = false;
    loginFreelancer: boolean = false;

    constructor (
        route: ActivatedRoute,
        router: Router
    ) {
        super(route, router);
        setTimeout(() => {
            organizationSlider.slide(this.el);
        }, 2000);
    }

    onProfileChanged() {
        super.onProfileChanged();
        this.setProfileType();
    }

    private setProfileType() {
        if (this.model.profileSysId.startsWith("company")) {
            this.loginCompany = true;
            this.loginFreelancer = false;
        } else {
            this.loginCompany = false;
            this.loginFreelancer = true;
        }
    }
}
