import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProfilePage } from './models';
import { ProfileService } from './profile.service';

import { ReviewProfileDialogService } from 'shared/dialogs/review/dialog.service';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { HireProfileDialogService } from 'shared/dialogs/hire/dialog.service';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { ContestReviewDialogService } from 'shared/dialogs/contest-review/dialog.service';
import { ExternalUrlDialogService } from 'shared/dialogs/external-url/dialog.service';
import { VerifyFacebookDialogService } from 'shared/dialogs/verify-facebook/dialog.service';
import { ReviewRequestIdentifier } from 'shared/dialogs/verify-facebook/models';
import { ISubscription } from 'rxjs/Subscription'
import { BudgetDetails } from '../shared/dialogs/budget-level/models';
import 'rxjs/add/operator/switchMap';
import { AuthService } from 'auth/auth.service';
import { BudgetLevelDialogService } from '../shared/dialogs/budget-level/dialog.service';
import { environment } from 'environments/environment';
import { ChatService } from 'chat/components/chat.service';
import { ChatConfig } from 'chat/config';
@Component({
    selector: 'ij-profile',
    templateUrl: 'profile.component.html',
    providers: [
        ReviewProfileDialogService,
        ContactProfileDialogService,
        HireProfileDialogService,
        ReferProfileDialogService,
        ContestReviewDialogService,
        ExternalUrlDialogService
    ]
})
export class ProfileComponent implements OnInit, OnDestroy {
    model: ProfilePage;
    profileUrl: string;
    public projectModel: BudgetDetails;
    reviewSub: ISubscription;

    constructor(
        private profileSvc: ProfileService,
        private route: ActivatedRoute,
        private reviewRequestDlg: VerifyFacebookDialogService,
        private budgetLevelDialogService: BudgetLevelDialogService,
        private authSvc: AuthService,
        private chatSvc: ChatService,
        private router: Router
    ) { }

    ngOnInit() {
        this.reviewSub = this.route.queryParams
            .filter(params => params.requestId)
            .subscribe(params => {
                if (params.requestId && params.revieweeId) {
                    const data = new ReviewRequestIdentifier(params.requestId, params.revieweeId)
                    this.reviewRequestDlg.showDialog(data);
                }
            });

        this.route.queryParams
            .filter(params => params.message_id)
            .subscribe(params => {
                if (params.message_id) {
                    let messageId = params.message_id;
                    let recipient = params.recipient;
                    if (this.authSvc.isLoggedIn) {
                        if (this.authSvc.profileSysId == recipient) {
                            setTimeout(() => {
                                this.openMessenger(messageId);
                            }, 1000);
                        }
                    }
                    else {
                        this.router.navigate(['/login'], { queryParams: { message_id: messageId, recipient: recipient }, queryParamsHandling: 'merge' });
                    }
                }
            });

        if (this.authSvc.isLoggedIn) {
            this.budgetLevelDialogService.showDialog(this.authSvc.profileSysId);
        }
    }

    ngOnDestroy() {
        if (this.reviewSub) {
            this.reviewSub.unsubscribe();
        }
    }

    private openMessenger(messageId): void {
        this.chatSvc.showChatWindow(messageId).subscribe(
            result => {
                let connection = ChatConfig.BASE_CONNECTION;
                connection.invoke('Contact', result.toProfileSysId, result.senderProfileSysId, null);
            });
    }
}
