import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/subscription';

import { AuthService } from 'auth/auth.service';
import { ProfileService } from '../profile.service';
import { ChangePasswordRequest } from './models';
import { patterns } from 'shared/view/regex-patterns';
import { multicast } from 'rxjs/operator/multicast';

@Component({
    selector: 'ij-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./settings.less'],
})
export class ChangePasswordComponent implements OnDestroy {
    public model: any = {
        currentPassword: null,
        newPassword: null,
        confirmPassword: null
    }

    public passwordRegex = patterns.password;
    public showSaveErrored: boolean;
    public submitted: boolean;
    private changeSub: ISubscription;

    constructor (
        private authSvc: AuthService,
        private profileSvc: ProfileService,
        private router: Router
    ) { }
 
    ngOnDestroy() {
        if (this.changeSub) {
            this.changeSub.unsubscribe();
        }
    }

    getValidationError(ctrl: NgModel) {
        if (!ctrl.invalid) {
            return "Please enter a password.";
        }
        else {
            const multiple = Object.keys(ctrl.errors).length > 1;

            if (ctrl.errors.equalTo && !multiple) {
                return "The passwords do not match.";
            }
            else {
                return "The password is incorrect.";
            }
        }
    }

    onChangePassword(f) {
        this.submitted = true;

        if (!f.valid) {
            return;
        }

        let req = new ChangePasswordRequest();
        Object.assign(req, this.model);

        this.changeSub = this.profileSvc.changePassword(req).subscribe(s => {
            this.showSaveErrored = false;
            this.authSvc.logout();
            this.router.navigate(['/login']);
        }, e => {
            this.showSaveErrored = true;
        });
    }
}