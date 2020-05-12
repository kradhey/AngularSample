import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { ErrorDialogService } from './dialog.service';

@Component({
    selector: 'ij-error-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class ErrorDialogComponent implements OnDestroy {
    dialogVisible: boolean;
    public projectName: string;
    public title: string;
    public message: string;
    private dialogSub: ISubscription;
    constructor(
        private dialogSvc: ErrorDialogService
    ) {
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(model => {
            this.title = model.title;
            this.message = model.message;
            this.showDialog();
        });
    }

    showDialog() {
        this.dialogVisible = true;
    }

    hideDialog() {
        this.dialogVisible = false;
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
}