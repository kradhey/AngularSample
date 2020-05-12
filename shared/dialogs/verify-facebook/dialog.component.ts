import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { VerifyFacebookDialogService } from './dialog.service';
import { ProjectItem, VerifyFacebookDialog, ReviewFormData, ReviewRequestIdentifier } from './models';
import { DialogHeaderService } from '../header/dialog-header.service';
import { VerifyFacebookService } from './verify-facebook.service';
import { LookupService } from 'shared/services/lookup.service';
import { CrewRole } from 'shared/services/CrewRole';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { environment } from 'environments/environment';
import { AuthService, AuthResult } from 'auth/auth.service';
import { SocialUser } from 'login/models';
import { NotificationsService } from 'angular2-notifications';
import { first } from 'rxjs/operator/first';
import { ProjectCardResponse } from 'profile/models';

enum VerifyStates {
    None,
    Facebook,
    IndustryJump
}

@Component({
    selector: 'ij-verify-facebook-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html',
    providers: [VerifyFacebookService, AuthService]
})
export class VerifyFacebookDialogComponent extends BaseDialogComponent<VerifyFacebookDialog> implements OnDestroy {
    allCrewRoles: CrewRole[] = [];
    crewRoleSuggestions: string[] = [];

    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private crewsSub: ISubscription;
    private getReviewSub: ISubscription;
    private verifyState: VerifyStates;
    private externalProviderToken: string;
    private socialUser: SocialUser;
    private isLoggedIn: boolean;
    private verifyRequest: ReviewRequestIdentifier;

    private verifyWithIJWindow: Window;
    private verifyWithFBWindow: Window;

    @ViewChild('selector') duplicateReview;
    @ViewChild('loginSelector') loginSelector;
    constructor(
        el: ElementRef,
        private dialogSvc: VerifyFacebookDialogService,
        private reviewRequestSvc: VerifyFacebookService,
        private lookupSvc: LookupService,
        private headerSvc: DialogHeaderService,
        private authSvc: AuthService,
        private router: Router,
    ) {
        super(VerifyFacebookDialog, el, null);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(model => {
            this.verifyRequest = model;
            this.resetForm(model.revieweeId);
            this.getCrewRoles();
            this.buildModel();
            if (this.authSvc.isLoggedIn) {
                this.verifyDuplicateReview();
            }
            else {
                this.showLoginDialog();
            }
        });
    }

    ngOnInit() {
        this.verifyState = VerifyStates.None;
        this.isLoggedIn = this.authSvc.isLoggedIn;
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }

        if (this.headerSub) {
            this.headerSub.unsubscribe();
        }

        if (this.crewsSub) {
            this.crewsSub.unsubscribe();
        }

        if (this.getReviewSub) {
            this.getReviewSub.unsubscribe();
        }
    }

    public onCrewRolesKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();

        this.crewRoleSuggestions = this.allCrewRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    protected onSend() {
        const req = new ReviewFormData(
            this.model.reliability,
            this.model.craftsmanship,
            this.model.communication,
            this.model.attitude,
            this.model.adjective1,
            this.model.adjective2,
            this.model.adjective3,
            this.model.projectId,
            this.model.comments,
            this.model.reviewerCrewRoles,
            this.model.socialUserId,
            this.verifyRequest.requestId
        );

        if (this.verifyState == VerifyStates.Facebook) {
            this.saveFacebookReview(req);
        }
        else {
            this.saveProfileReview(req);
        }
    }

    private saveFacebookReview(form: ReviewFormData) {
        this.reviewRequestSvc
            .saveFacebookReview(this.profileSysId, form)
            .first()
            .subscribe
            (
            r => {
                this.onSaveSuccess().then(_ => {
                    window.location.href = `/profile/${this.model.header.userProfileUrlDisplayName}`;
                });
            },
            e => this.onSaveError(e)
            );
    }

    private saveProfileReview(form: ReviewFormData) {
        this.reviewRequestSvc
            .saveProfileReview(this.profileSysId, form)
            .first()
            .subscribe
            (
            r => {
                this.onSaveSuccess().then(_ => {
                    window.location.href = `/profile/${this.model.header.userProfileUrlDisplayName}`;
                });
            },
            e => this.onSaveError(e)
            );
    }

    private showReviewDialog() {
        this.disableSubmit = false;
        this.model.projects = [];
        if (!this.authSvc.isLoggedIn) {
            this.model.projectId = 0;
            this.showDialog();
        }
        else {
            this.getReviewSub = this.reviewRequestSvc.getReviewDialog(this.profileSysId).subscribe(dialog => {
                this.model.projects = dialog.projects;
                if (this.model.projects.length === 0) {
                    this.model.projectId = 0;
                }
                this.showDialog();
            }, e => this.onLoadError());
        }
    }

    private getCrewRoles() {
        this.crewsSub = this.lookupSvc.getCrewRoles().subscribe(crewRoles => {
            this.allCrewRoles = crewRoles;
        }, e => this.onLoadError());
    }

    verifyByFacebook() {
        let externalProviderUrl = environment.endpoints.auth.externalLogin('Facebook');

        this.verifyWithFBWindow = window.open(externalProviderUrl,
            "Authenticate Account",
            "location=0,status=0,width=600,height=750");

        let domain = environment.endpoints.auth.siteApiUrl;
        setInterval(this.verifyWithFBHandler, 5000);

        window.addEventListener("message", this.verifyWithFBEventListner, false);
    }

    private verifyWithFBHandler = () => {
        let message = "Hello!  The time is: " + (new Date().getTime());
        let domain = environment.endpoints.auth.siteApiUrl;
        this.verifyWithFBWindow.postMessage(message, domain);
    }

    private verifyWithFBEventListner = (event: MessageEvent) => {
        if (event.origin !== environment.endpoints.auth.siteApiUrl) {
            return;
        }
        else if (this.router.url.indexOf('/profile') < 0) {
            return;
        }

        if (event.data != null) {
            this.getExternalUserInfo(event.data.access_token);
        }

        this.verifyWithFBWindow.close();
    }

    verifyWithIJ() {
        let current = this;
        let externalProviderUrl = environment.site.login;

        this.verifyWithIJWindow = window.open(externalProviderUrl,
            "Authenticate Account",
            "location=0,status=0,width=600,height=750");

        localStorage.setItem(environment.storage.auth.loginWithIJ, 'initiate');
        setInterval(this.verifyWithIJHandler, 500);
    }

    private verifyWithIJHandler = () => {
        if (this.authSvc.isLoggedInWithIJ == 'complete') {
            localStorage.removeItem(environment.storage.auth.loginWithIJ);
            this.verifyState = VerifyStates.IndustryJump;
            this.verifyWithIJWindow.close();
            this.verifyDuplicateReview();
        }
    }

    private getExternalUserInfo(access_token: string) {
        this.authSvc
            .externalUserInfo(access_token)
            .first()
            .subscribe(userInfo => {
                this.model.socialUserId = userInfo.socialUserId;
                this.verifyState = VerifyStates.Facebook;
                this.verifyRequest.socialUserId = userInfo.socialUserId;
                this.verifyDuplicateReview();
            }, e => this.onLoadError()
            );
    }

    private verifyDuplicateReview(verifyCallBack: boolean = false) {
        this.reviewRequestSvc
            .validateReview(this.verifyRequest)
            .first()
            .subscribe(r => {
                this.loginSelector.hideDialog();
                if (r.hasErrors) {
                    this.dialogVisible = false;
                    this.duplicateReview.projectName = r.projectName;
                    this.duplicateReview.title = r.errorMessageTitle;
                    this.duplicateReview.message = r.errorMessage;
                    this.duplicateReview.showDialog();
                }
                else if (!verifyCallBack) {
                    this.showReviewDialog();
                }
                else {
                    this.isLoggedIn = this.authSvc.isLoggedIn;
                    this.disableSubmit = false;
                }
            },
                e => this.onSaveError(e)
            );
    }

    private buildModel() {
        let model = this.newModel();
        this.model = model;
        this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
            DialogHeader.SetProfileImageUrl(header);
            this.model.header = header;
        });
    }

    private showLoginDialog() {
        this.loginSelector.showDialog();
    }

}
