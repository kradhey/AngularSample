import { Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ReviewRequestDialogService } from './dialog.service';
import { DialogHeaderService } from '../header/dialog-header.service';
import { ReviewProfileService } from '../review/review-profile.service';
import { ReviewRequestService } from './review-request.service';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { ReviewRequestDialog, ReviewRequest } from './models'
import { NotificationsService } from 'angular2-notifications';

import 'rxjs/add/operator/first';

@Component({
    selector: 'ij-review-request-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html',
    providers: [ReviewProfileService, ReviewRequestService]
})
export class ReviewRequestDialogComponent extends BaseDialogComponent<ReviewRequestDialog> implements OnDestroy {
    crewRoleSuggestions: string[] = [];

    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private getReviewSub: ISubscription;

    @ViewChild("selector") selector;
    
    get profileSysIdCurrent(): string {
        if (this.selector && typeof (this.selector.selected) == "object" && this.selector.selected) {
            return this.selector.selected.profileSysId;
        }
        return null;
    }

    get fullName(): string {
        if (this.selector && typeof (this.selector.selected) == "string" && this.selector.selected) {
            return this.selector.selected;
        }
        return null;
    }

    hasUserFromSystem(value) {
        this.model.showEmail = !value;
    }

    protected get SaveMessage() {
        return "Your request has been sent.";
    }

    constructor (
        el: ElementRef,
        private dialogSvc: ReviewRequestDialogService,
        private reviewSvc: ReviewProfileService,
        private headerSvc: DialogHeaderService,
        private requestReviewSvc: ReviewRequestService,
        notificationSvc: NotificationsService
    ) {
        super(ReviewRequestDialog, el, notificationSvc);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
            this.resetForm(profileSysId);
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
    }

    onShow() {
        setTimeout(() => {
            if (this.selector) {
                this.selector.focus();
            }
        }, 250);
    }

    protected onSend() {
        const req = new ReviewRequest
        (
            this.fullName,
            this.profileSysIdCurrent,
            this.model.email
        );

        this.requestReviewSvc
            .requestReview(req)
            .first()
            .subscribe
            (
                r => this.onSaveSuccess().then(()=>{
                    setTimeout(() => {
                        window.location.reload();
                      }, 1500)}),
                e => this.onSaveError(e),
            );
    }

    private buildModel() {
        this.getReviewSub = this.reviewSvc.getReviewDialog(this.profileSysId).subscribe(dialog => {
            let model = this.newModel();
            model.projects = dialog.projects;
            model.showEmail = true;
            this.model = model;
            
            this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
                DialogHeader.SetProfileImageUrl(header);
                this.model.header = header;
                this.showDialog();
            });

        }, e => this.onLoadError());
    }
}