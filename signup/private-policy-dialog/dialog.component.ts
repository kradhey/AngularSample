import { Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { PrivatePolicyDialogService } from  './dialog.service'

@Component({
    selector: 'ij-private-policy-dialog',
    styleUrls: ['../dialogs.less'],
    templateUrl: 'dialog.component.html'
})
export class PrivatePolicyDialogComponent implements OnDestroy {
    dialogVisible: boolean;
    private dialogSub: ISubscription;

    constructor(private dialogSvc: PrivatePolicyDialogService) {
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(x => {
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