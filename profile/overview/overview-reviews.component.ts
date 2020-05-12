import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage, ReviewCard, ReviewRequest } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { ReviewProfileDialogService } from 'shared/dialogs/review/dialog.service';
import { ReviewRequestDialogService } from 'shared/dialogs/review-request/dialog.service';
import { ContestReviewDialogService } from 'shared/dialogs/contest-review/dialog.service';
import { ConfirmationService } from 'primeng/primeng';
import { AuthService } from 'auth/auth.service';
import { ProfileService } from 'profile/profile.service';
import { first } from 'rxjs/operator/first';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ConfirmationDialogService } from 'shared/dialogs/confirmation-dialog/dialog.service';
import { ConfirmationDialog } from 'shared/dialogs/confirmation-dialog/models';
import { ErrorDialogService } from 'shared/dialogs/error-dialog/dialog.service';
import { ErrorDialog } from 'shared/dialogs/error-dialog/models';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'ij-profile-overview-reviews',
    templateUrl: 'overview-reviews.component.html',
    styleUrls: ['./styles/reviews.less'],
    providers: [ConfirmationService]
})
export class ProfileOverviewReviewsComponent extends BaseProfileComponent {
    requests: ReviewRequest[];
    requestReview: boolean = false;
    errors: string[] = [];
    review: boolean = true;
    selectedId: number;
    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    constructor(
        route: ActivatedRoute,
        router: Router,
        notificationSvc: NotificationsService,
        private profileSvc: ProfileService,
        private reviewDlg: ReviewProfileDialogService,
        private contestDlg: ContestReviewDialogService,
        private reviewRequestDlg: ReviewRequestDialogService,
        private authSvc: AuthService,
        private confirmSvc: ConfirmationService,
        private confirmDlg: ConfirmationDialogService,
        private errorDlg: ErrorDialogService
    ) {
        super(route, router, notificationSvc);
    }

    onReview() {
        if (this.model.isOwnProfile) {
            this.reviewRequestDlg.showDialog(this.model.profileSysId);
        }
        else {
            this.reviewDlg.showDialog(this.model.profileSysId);
        }
    }

    onReport(review: ReviewCard) {
        this.contestDlg.showDialog(review);
    }

    trackCard(card: ReviewCard) {
        return card == null ? null : card.id;
    }

    onSeeReviewRequests() {
        this.requestReview = true;
        this.review = false;
    }

    onSeeReviews() {
        this.requestReview = false;
        this.review = true;
    }

    onProfileChanged() {
        super.onProfileChanged();
        this.onSeeReviews();
        this.getReviewRequests();
    }

    onDeleteRequest(id: number) {
        this.confirmSvc.confirm({
            message: "Are you sure you want to delete this request?",
            header: "Delete Request",
            rejectVisible: true,
            accept: () => {
                this.profileSvc
                    .deleteReviewRequest(id)
                    .first()
                    .subscribe(resp => { this.onDeleted(id); });
            }
        });
    }

    onResendRequest(id: number) {
        this.selectedId = id;
        this.profileSvc
            .validateResendReviewRequest(id)
            .first()
            .subscribe(resp => {
                if (resp.hasErrors) {
                    let errorDialog = new ErrorDialog();
                    errorDialog.title = resp.errorMessageTitle;
                    errorDialog.message = resp.errorMessage;
                    this.errorDlg.showDialog(errorDialog);
                }
                else {
                    let confirmModel = new ConfirmationDialog();
                    confirmModel.confirmMessage = resp.confirmationMessage;
                    confirmModel.message = resp.lastResendMessage;
                    confirmModel.title = 'Resend Review Request';
                    this.confirmDlg.showDialog(confirmModel);
                }
            });
    }


    onResendAccept(result: boolean) {
        this.profileSvc
            .resendReviewRequest(this.selectedId)
            .first()
            .subscribe(resp => {
                this.confirmDlg.hideDialog(true);
                this.saveMessage = 'You review request resend successfully.'
                this.onSaveSuccess();
            });
    }

    private getReviewRequests() {
        if (!this.model.isOwnProfile) {
            return;
        }

        this.profileSvc
            .getReviewRequests()
            .first()
            .subscribe(resp => { this.buildReviewRequests(resp); });
    }

    private buildReviewRequests(resp) {
        if (!resp) {
            this.requests = [];
        }

        this.requests = resp;

        for (let r of this.requests) {
            if (r.requestToSysId) {
                //r.overviewUrl = environment.site.overview(r.requestToSysId);
                r.overviewUrl = environment.site.profileUrl(r.userProfileUrlDisplayName,"");
            }
        }
    }

    private onDeleted(id: number) {
        const request = this.requests.find(r => r.id == id);
        const index = this.requests.indexOf(request);
        this.requests.splice(index, 1);
    }
}