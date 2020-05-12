import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ContestReviewDialog, ReviewTypes } from './models';
import { ContestReviewDialogService } from './dialog.service';
import { ContestReviewService } from './contest-review.service';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { AuthService } from 'auth/auth.service';

import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'ij-contest-review-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['styles.less'],
    providers: [ContestReviewService]
})
export class ContestReviewDialogComponent extends BaseDialogComponent<ContestReviewDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    private getContestSub: ISubscription;
    private saveContestSub: ISubscription;

    protected get SaveMessage() {
        return "Your report has been sent.";
    }

    constructor(
        el: ElementRef,
        private contestSvc: ContestReviewService,
        private dialogSvc: ContestReviewDialogService,
        private authSvc: AuthService,
        notificationSvc: NotificationsService
    ) {
        super(ContestReviewDialog, el, notificationSvc);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(review => {
            this.resetForm(this.authSvc.profileSysId);
            this.buildModel(review.id, review.reviewType);
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }

        if (this.getContestSub) {
            this.getContestSub.unsubscribe();
        }

        if (this.saveContestSub) {
            this.saveContestSub.unsubscribe();
        }
    }

    protected onSend() {
        const body = {
            reason: this.model.reason,
            reviewType: this.model.reviewType
        };

        this.saveContestSub = this.contestSvc.sendContest(this.model.id, body)
            .subscribe
            (
                r => {
                    this.onSaveSuccess().then(_ => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    });
                },
                e => this.onSaveError(e),
            );
    }

    protected buildModel(reviewId: number, reviewType: ReviewTypes) {
        this.getContestSub = this.contestSvc.getContest(reviewId, reviewType).subscribe(review => {
            DialogHeader.SetProfileImageUrl(review.reviewer);
            DialogHeader.SetProfileImageUrl(review.reviewee);
            Object.assign(this.model, review);
            this.model.reviewType = reviewType;
            this.showDialog();
        }, e => this.onLoadError());
    }
}