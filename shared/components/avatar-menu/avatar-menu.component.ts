
import { retry } from 'rxjs/operators/retry';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'ij-avatar-menu',
    templateUrl: './avatar-menu.component.html',
    styleUrls: ['./avatar-menu.less'],
})
export class AvatarMenuComponent {
    profileName: string;
    companyLogin: boolean;
    freelancerLogin: boolean;

    constructor(
        private authSvc: AuthService,
        private router: Router
    ) { }
    get profileUrl() {
        return environment.site.profileUrl(this.authSvc.fullName, this.authSvc.userPositionInList);
    }

    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    logout() {
        this.authSvc.logout();
        localStorage.clear();
        this.router.navigate(["/"]);
    }

    protected getThumbnailImageUrl() {
        if (this.authSvc.thumbnailImageName) {
            return environment.site.imageUrl(this.authSvc.thumbnailImageName);
        }

        return "/assets/images/avatars/avatar-sm.png";
    }
}