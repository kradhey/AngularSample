
import { retry } from 'rxjs/operators/retry';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'ij-profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.less'],
})
export class ProfileMenuComponent implements OnInit {
    profileName: string;
    companyLogin: boolean;
    freelancerLogin: boolean;
    @Input("menuWhiteColor") menuWhiteColor: boolean;
    constructor (
        private authSvc: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        if(this.authSvc.isLoggedIn) {
            this.setLoginInfo();
        }
    }

    get profileUrl() {
        //to be changed
        //return environment.site.overview(this.authSvc.profileSysId);
        return environment.site.overview(this.authSvc.userProfileUrlDisplayName);
    }

    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }
    get isSiteHeader() {
        return this.menuWhiteColor ? true : false;
    }
    logout() {
        this.authSvc.logout();
        localStorage.clear();
        this.router.navigate(["/"]);
    }
    private setLoginInfo() {
        this.profileName = this.authSvc.profileSysId;
        
        if(this.profileName.startsWith("freelancer")) {
            this.companyLogin=false
            this.freelancerLogin=true;
        }
        else {
            this.companyLogin=true;
            this.freelancerLogin=false;
        }
    }
}