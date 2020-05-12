import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage, ReviewCard, PagerRequest, DefaultPageSize, CardResponse, Reviewer } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { ProfileService } from 'profile/profile.service';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { ContestReviewDialogService } from 'shared/dialogs/contest-review/dialog.service';
import { ChatConfig } from 'chat/config';
import { ISubscription } from 'rxjs/Subscription';
import { ContactFacebookDialogService } from 'shared/dialogs/contact-facebook/dialog.service';
import { first } from 'rxjs/operator/first';

@Component({
    selector: 'ij-profile-reviews',
    templateUrl: './profile-reviews.component.html',
    styleUrls: ['./reviews.less']
})
export class ProfileReviewsComponent extends BaseProfileComponent {
    hasMoreReviews: boolean = false;
    private lastReviewReq: PagerRequest;

    constructor (
        route: ActivatedRoute,
        router: Router,
        private profileSvc: ProfileService,
        private contactDlg: ContactProfileDialogService,
        private contestDlg: ContestReviewDialogService,
        private contactFacebookDlg: ContactFacebookDialogService
    ) {
        super(route, router);
    }

    onProfileChanged() {
        super.onProfileChanged();
        
        if (this.model.reviews && this.model.reviews.pager) {
            this.hasMoreReviews = this.model.reviews.pager.hasMore;
        }
    }

    trackCard(card: ReviewCard) {
        return card == null ? null : card.id;
    }

    onViewMoreClicked() {
        if (this.lastReviewReq == null) {
            this.lastReviewReq = new PagerRequest();
            this.lastReviewReq.page = 1;
            this.lastReviewReq.pageSize = DefaultPageSize;
        }

        let request = Object.assign({}, this.lastReviewReq);
        request.page++;

        this.getReviews(this.model.profileSysId, request);
    }

    onReportClicked(reviewId: number) {
        this.contestDlg.showDialog(reviewId);
    }

    onContactClicked(reviewer: Reviewer) {
        if (reviewer.profileSysId == null) {
            this.contactFacebookDlg.showDialog(reviewer.socialUserId,  ChatConfig.BASE_CONNECTION);
        }
        else {
            this.contactDlg.showDialog(reviewer.profileSysId, ChatConfig.BASE_CONNECTION);
        }
    }

    private getReviews(profileSysId: string, request: PagerRequest) {
        this.profileSvc
            .getReviews(profileSysId, request)
            .first()
            .subscribe
            (
                r => this.onGetSuccessful(r),
                e => this.onGetError(e)
            );
    }

    private onGetSuccessful(res: CardResponse<ReviewCard>) {
        this.lastReviewReq.page = res.pager.current;
        this.hasMoreReviews = res.pager.hasMore;
        if (res.cards) {
            for (const card of res.cards) {
                Reviewer.Initialize(card.reviewer);
            }
        }

        this.model.reviews.cards.push(...res.cards);
    }

    private onGetError(e) {}
}