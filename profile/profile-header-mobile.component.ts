import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from './models';
import { BaseProfileComponent } from './BaseProfileComponent';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { HireProfileDialogService } from 'shared/dialogs/hire/dialog.service';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { ConfirmationService } from 'primeng/primeng';
import { AuthService } from 'auth/auth.service';
import { ChatConfig } from 'chat/config';
import { SignalRConnection } from '@dharapvj/ngx-signalr';

@Component({
    selector: 'ij-profile-header-mobile',
    templateUrl: './profile-header-mobile.component.html',
    styleUrls: ['./styles/header-mobile.less'],
    providers: [ConfirmationService]
})
export class ProfileHeaderMobileComponent extends BaseProfileComponent {
    private _connection: SignalRConnection;
    nonUserMessage: string = "We only allow logged in users refer, contact and hire. Please login or create an account";
    constructor (
        route: ActivatedRoute,
        router: Router,
        private contactDlg: ContactProfileDialogService,
        private hireDialog: HireProfileDialogService,
        private referDialog: ReferProfileDialogService,
        private confirmSvc: ConfirmationService,
        private authSvc: AuthService
    ) {
        super(route, router);
    }

    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    gotoExternalSite(site) {
        this.confirmSvc.confirm({
            message: `You are about to leave Industry Jump. Are you sure you want to continue? Please take a moment and review the URL below.<br><br><span class="externalurl">${site}</span>`,
            header: "External Web Site",
            rejectVisible: true,
            accept: () => {
                this.openExternalWindow(site);
            }
        });
    }

    onContact() {
        if (this.isLoggedIn) {
            if (!this._connection) {
                this._connection = ChatConfig.BASE_CONNECTION;
            }
            this._connection.invoke('Contact', this.model.profileSysId, this.authSvc.profileSysId, null);
        }
        else {
            this.confirmSvc.confirm({
                message: this.nonUserMessage,
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    onRefer() {
        if (this.isLoggedIn) {
            this.referDialog.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: this.nonUserMessage,
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    onHire() {
        if (this.isLoggedIn) {
            this.hireDialog.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: this.nonUserMessage,
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }
}