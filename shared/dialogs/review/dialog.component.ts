import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ReviewProfileDialogService } from './dialog.service';
import { ProjectItem, ReviewProfileDialog, ReviewProfileRequest } from './models';
import { DialogHeaderService } from '../header/dialog-header.service';
import { ReviewProfileService } from './review-profile.service';
import { LookupService } from 'shared/services/lookup.service';
import { CrewRole } from 'shared/services/CrewRole';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { NotificationsService } from 'angular2-notifications';

import 'rxjs/add/operator/first';

@Component({
    selector: 'ij-review-profile-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html',
    providers: [ReviewProfileService]
})
export class ReviewProfileDialogComponent extends BaseDialogComponent<ReviewProfileDialog> implements OnDestroy {
    allCrewRoles: CrewRole[] = [];
    crewRoleSuggestions: string[] = [];

    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private getReviewSub: ISubscription;
    private crewsSub: ISubscription;

    protected get SaveMessage() {
        return "Your review has been sent.";
    }

    constructor (
        el: ElementRef,
        private dialogSvc: ReviewProfileDialogService,
        private reviewSvc: ReviewProfileService,
        private lookupSvc: LookupService,
        private headerSvc: DialogHeaderService,
        notificationSvc: NotificationsService
    ) {
        super(ReviewProfileDialog, el, notificationSvc);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
            this.resetForm(profileSysId);
            this.getCrewRoles();
            this.buildModel();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }

        if (this.headerSub) {
            this.headerSub.unsubscribe();
        }

        if (this.getReviewSub) {
            this.getReviewSub.unsubscribe();
        }

        if (this.crewsSub) {
            this.crewsSub.unsubscribe();
        }
    }
    
    public onCrewRolesKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();

        this.crewRoleSuggestions = this.allCrewRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    protected onSend() {
        const req = new ReviewProfileRequest
        (
            this.model.reliability,
            this.model.craftsmanship,
            this.model.communication,
            this.model.attitude,
            this.model.adjective1,
            this.model.adjective2,
            this.model.adjective3,
            this.model.projectId,
            this.model.comments,
            this.model.reviewerCrewRoles
        );

        this.reviewSvc
            .saveReview(this.profileSysId, req)
            .first()
            .subscribe
            (
                r => {
                    this.onSaveSuccess().then(_ => {
                        window.location.reload();
                    });
                },
                e => this.onSaveError(e)
            );
    }

    private buildModel() {
        this.getReviewSub = this.reviewSvc.getReviewDialog(this.profileSysId).subscribe(dialog => {
            let model = this.newModel();
            model.projects = dialog.projects;
            this.model = model;

            this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
                DialogHeader.SetProfileImageUrl(header);
                this.model.header = header;
                this.showDialog();
            });

        }, e => this.onLoadError());
    }

    private getCrewRoles() {
        this.crewsSub = this.lookupSvc.getCrewRoles().subscribe(crewRoles => {
            this.allCrewRoles = crewRoles;
        }, e => this.onLoadError());
    }
}