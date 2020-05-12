import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ContactProfileDialogService } from './dialog.service';
import { ContactProfileService } from './contact-profile.service';
import { DialogHeaderService } from '../header/dialog-header.service';;
import { ContactProfileDialog } from './models';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'environments/environment';

import { PushNotificationsService } from 'ng-push';
import { AuthService } from 'auth/auth.service';
import { ErrorDialogService } from 'shared/dialogs/error-dialog/dialog.service';
import { ErrorDialog } from 'shared/dialogs/error-dialog/models';
import { SignalRConnection } from '@dharapvj/ngx-signalr';
import { ActivatedRoute } from '@angular/router';
import { ChatDialogService } from 'chat/components/dialog.service';
import { ChatConfig } from 'chat/config';
import { ChatWindow, Data } from 'chat/components/models';

@Component({
    selector: 'ij-contact-profile-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['styles.less'],
    providers: [ContactProfileService]
})
export class ContactProfileDialogComponent extends BaseDialogComponent<ContactProfileDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private contactSub: ISubscription;
    private connection: SignalRConnection;
    protected get SaveMessage() {
        return "Your message has been sent!";
    }

    constructor(
        el: ElementRef,
        private dialogSvc: ContactProfileDialogService,
        private contactSvc: ContactProfileService,
        private headerSvc: DialogHeaderService,
        notificationSvc: NotificationsService,
        private _pushNotifications: PushNotificationsService,
        private authSvc: AuthService,
        private errorDlg: ErrorDialogService,
        private route: ActivatedRoute,
        private chatDialog: ChatDialogService,
    ) {
        super(ContactProfileDialog, el, notificationSvc);
        console.log('contact dialog called');
        // this.chatDialog.showToChatDialog({}, ChatConfig.BASE_CONNECTION);
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(data => {
            this.connection = data.connection || route.snapshot.data['connection'];
            this.resetForm(data.profileSysId);

            if (data.profileSysId == this.authSvc.profileSysId) {
                let title = "Not allowed";
                let errorMessage = "You cannot reference check yourself.";
                this.verifyDialog(title, errorMessage);
            }
            else {
                this.buildModel();
            }
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }

        if (this.headerSub) {
            this.headerSub.unsubscribe();
        }

        if (this.contactSub) {
            this.contactSub.unsubscribe();
        }
    }

    protected onSend() {
        this.contactSub = this.contactSvc
            .sendMessage(this.profileSysId, this.model.message)
            .subscribe
            (
            r => {
                let myProfileId = localStorage.getItem(environment.storage.auth.profileSysId);
                this.connection.invoke('Contact', this.profileSysId, myProfileId, r.messageId);
                // .then((data: any) => {
                //     this.chatDialog.showToChatDialog(new Data<ChatWindow>(data)); // data, ChatConfig.BASE_CONNECTION);
                // });
                this.onSaveSuccess();
            },
            e => this.onSaveError(e),
        );


        this.hideDialog();
    }

    private buildModel() {
        this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
            this.model = this.newModel();
            DialogHeader.SetProfileImageUrl(header);
            this.model.header = header;
            this.showDialog();
        }, e => this.onLoadError());
    }

    private verifyDialog(title: string, errorMessage: string) {
        let errorDialog = new ErrorDialog();
        errorDialog.title = title;
        errorDialog.message = errorMessage;
        this.errorDlg.showDialog(errorDialog);
    }
}