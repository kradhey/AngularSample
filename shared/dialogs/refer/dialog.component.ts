import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { constants } from 'environments/constants';
import { DialogHeaderService } from '../header/dialog-header.service';;
import { ReferProfileDialogService } from './dialog.service';
import { ReferService } from './refer.service';
import { ReferDialog, ReferRequest } from './models';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { NotificationsService } from 'angular2-notifications';

import 'rxjs/add/operator/first';
import { SignalRConnection } from '@dharapvj/ngx-signalr';
import { ChatConfig } from 'chat/config';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ij-refer-profile-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['styles.less'],
    providers: [ReferService]
})
export class ReferProfileDialogComponent extends BaseDialogComponent<ReferDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private connection: SignalRConnection;
    @ViewChild("selector") selector;

    get emails(): string[] {
        const values = this.model.emails;

        if (values) {
            if (values.indexOf(",")) {
                const emails = this.model.emails.split(",", constants.multiEmails.maxSize);
                const filtered = emails.filter(e => e);
                return filtered.map(f => f.trim());
            }
            return [values.trim()];
        }
        return null;
    }

    get profileSysIds(): string[] {
        if (this.selector && this.selector.selected && typeof (this.selector.selected) == "object") {
            return [this.selector.selected.profileSysId];
        }
        return null;
    }

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

    protected get SaveMessage() {
        return "Your referral has been sent.";
    }

    constructor(
        el: ElementRef,
        private dialogSvc: ReferProfileDialogService,
        private headerSvc: DialogHeaderService,
        private referSvc: ReferService,
        notificationSvc: NotificationsService,
        private route: ActivatedRoute
    ) {
        super(ReferDialog, el, notificationSvc);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
            this.connection = ChatConfig.BASE_CONNECTION || route.snapshot.data['connection'];
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
    }

    onShow() {
        setTimeout(() => {
            if (this.selector) {
                this.selector.focus();
            }
        }, 0);
    }

    hasUserFromSystem(value) {
        this.model.showEmail = !value;
    }

    protected onSend() {
        const req = new ReferRequest();

        req.emails = this.emails;
        req.profileSysIds = this.profileSysIds;
        req.message = this.model.message;
        req.fullName = this.fullName;

        this.referSvc
            .refer(this.profileSysId, req)
            .first()
            .subscribe(
                result => {
                    console.log(result);
                    this.connection.invoke('SaveNotification', result).then((data: any) => {
                    });
                    this.onSaveSuccess();
                },
                e => this.onSaveError(e),
        );
    }

    private buildModel() {
        this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
            this.model = this.newModel();
            DialogHeader.SetProfileImageUrl(header);
            this.model.header = header;
            this.model.showEmail = true;
            this.model.currentProfileSysId = this.profileSysId;
            this.showDialog();
        }, e => this.onLoadError());
    }
}