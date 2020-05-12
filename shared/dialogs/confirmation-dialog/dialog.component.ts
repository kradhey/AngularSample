import { Component, ElementRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { environment } from 'environments/environment';
import { ConfirmationDialog } from './models';
import { ConfirmationDialogService } from './dialog.service';

@Component({
    selector: 'ij-confirmation-dialog',
    templateUrl: 'dialog.component.html'
})
export class ConfirmationDialogComponent extends BaseDialogComponent<ConfirmationDialog> implements OnInit, OnDestroy {
    private dialogSub: ISubscription;

    constructor(el: ElementRef, private dialogSvc: ConfirmationDialogService) {
        super(ConfirmationDialog, el, null);

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(model => {
            if (model) {
                this.model = model;
            }
            this.showDialog();
        });

        this.dialogSub = this.dialogSvc.hideDialog$.subscribe(model => {
            if (model) {
                this.hideDialog();
            }
        });
    }

    ngOnInit() {
        this.model.title = 'Confirmation';
        this.model.message = '';
        this.model.confirmMessage = 'Are you sure?';
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }

    @Output() onAcceptEvent = new EventEmitter<boolean>();
    onAccept() {
        this.onAcceptEvent.emit(true);
    }
}