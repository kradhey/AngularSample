import { Component, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { VerifyFacebookDialog } from 'shared/dialogs/verify-facebook/models';

@Component({
    selector: 'ij-review-login-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class ReviewLoginComponent {
    dialogVisible: boolean;
    public projectName: string;
    public title: string;
    public message: string;
    @Input("model")
    model: VerifyFacebookDialog;
    @Output() onVerifyWithIJ = new EventEmitter();
    @Output() onVerifyByFacebook = new EventEmitter();
    constructor(
    ) {
    }
    showDialog() {
        this.dialogVisible = true;
    }

    hideDialog() {
        this.dialogVisible = false;
    }

    verifyWithIJ(){
        this.onVerifyWithIJ.emit();
    }

    verifyByFacebook(){
        this.onVerifyByFacebook.emit();
    }
}