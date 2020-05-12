import { Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { SignupTermsDialogService } from  './dialog.service'

@Component({
    selector: 'ij-sign-up-terms-dialog',
    styleUrls: ['../dialogs.less'],
    templateUrl: 'dialog.component.html'
})
export class SignupTermsDialogComponent implements OnDestroy {
    dialogVisible: boolean;
    private dialogSub: ISubscription;
    
    constructor(private dialogSvc: SignupTermsDialogService) {
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(_ => {
            this.showDialog();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
    
    showDialog() {
        this.dialogVisible = true;
    }

    onAccept(){
        this.dialogSvc.acceptTerm(true);
        this.dialogVisible = false;
    }

    onDeny(){
        this.dialogSvc.acceptTerm(false);
        this.dialogVisible = false;
    }
}