import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ContactFacebookDialogService } from './dialog.service';
import { ContactFacebookService } from './contact-facebook.service';
import { DialogHeaderService } from '../header/dialog-header.service';;
import { ContactFacebookDialog } from './models';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'environments/environment';
import { NgForm } from '@angular/forms';

import { PushNotificationsService } from 'ng-push';
import { AuthService } from 'auth/auth.service';
import { ErrorDialog } from 'shared/dialogs/error-dialog/models';
import { ErrorDialogService } from 'shared/dialogs/error-dialog/dialog.service';

@Component({
    selector: 'ij-contact-facebook-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['styles.less'],
    providers: [ContactFacebookService]
})
export class ContactFacebookDialogComponent extends BaseDialogComponent<ContactFacebookDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private contactSub: ISubscription;
    private currentProfileSysId: string;

    protected get SaveMessage() {
        return "Your message has been sent!";
    }
    
    constructor(
        el: ElementRef,
        private dialogSvc: ContactFacebookDialogService,
        private contactSvc: ContactFacebookService,
        private headerSvc: DialogHeaderService,
        private authSvc: AuthService,
        notificationSvc: NotificationsService,
        private errorDlg: ErrorDialogService
    ) {
        super(ContactFacebookDialog, el, notificationSvc);

        this.currentProfileSysId = this.authSvc.currentProfileSysId;
        
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(data => {
            if (!this.authSvc.isLoggedIn){
                let title = "Not available";
                let errorMessage = "You must login to reference check users.";
                this.verifyDialog(title, errorMessage);
            }
            else if (this.authSvc.profileSysId != this.currentProfileSysId) {
                this.resetForm(null, data.socialUserId);
                this.buildModel();
            }
            else {
                let title = "Not allowed";
                let errorMessage = "You cannot reference check yourself.";
                this.verifyDialog(title, errorMessage);
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

    protected onSend(form: NgForm) {
        this.ngForm = form;
        this.showSaveErrored = false;
        this.submitted = true;

        if (!form.valid || !this.socialUserId) return;
        
        this.disableSubmit = true;

        this.contactSub = this.contactSvc
            .sendMessage(this.model.message, this.socialUserId, this.currentProfileSysId)
            .subscribe
            (
                r => this.onSaveSuccess(),
                e => this.onSaveError(e),
            );
    }

    private buildModel() {
        this.headerSub = this.headerSvc.getSocialUserData(this.socialUserId).subscribe(header => {
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