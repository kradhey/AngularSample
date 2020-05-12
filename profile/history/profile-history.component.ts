import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage, ReviewCard, PagerRequest, DefaultPageSize, CardResponse, Reviewer, ProfileHistoryResponse } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { ProfileService } from 'profile/profile.service';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { ContestReviewDialogService } from 'shared/dialogs/contest-review/dialog.service';
import { ProfileHistoryTypes } from 'shared/services/ProfileHistoryTypes';
import { ISubscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operator/first';

@Component({
    selector: 'ij-profile-history',
    templateUrl: './profile-history.component.html',
    styleUrls: ['./history.less']
})
export class ProfileHistoryReviewsComponent extends BaseProfileComponent {
    hasMoreHistory: boolean = false;    
    historyTypes = ProfileHistoryTypes;

    private lastHistoryReq: PagerRequest;

    constructor (
        route: ActivatedRoute,
        router: Router,
        private profileSvc: ProfileService,
        private contactDlg: ContactProfileDialogService,
        private contestDlg: ContestReviewDialogService
    ) {
        super(route, router);
    }

    onProfileChanged() {
        super.onProfileChanged();

        if (this.model.profileHistory && this.model.profileHistory.pager) {
            this.hasMoreHistory = this.model.profileHistory.pager.hasMore;
        }
    }

    onViewMoreClicked() {
        if (this.lastHistoryReq == null) {
            this.lastHistoryReq = new PagerRequest();
            this.lastHistoryReq.page = 1;
            this.lastHistoryReq.pageSize = DefaultPageSize;
        }

        let request = Object.assign({}, this.lastHistoryReq);
        request.page++;

        this.getHistory(this.model.profileSysId, request);
    }

    private getHistory(profileSysId: string, request: PagerRequest) {
        this.profileSvc.getHistory(profileSysId, request)
            .first()
            .subscribe
            (
                r => this.onGetSuccessful(r),
                e => this.onGetError(e)
            );
    }

    private onGetSuccessful(res: ProfileHistoryResponse) {
        this.lastHistoryReq.page = res.pager.current;
        this.hasMoreHistory = res.pager.hasMore;
        this.model.profileHistory.items.push(...res.items);
    }

    private onGetError(e) {}
}