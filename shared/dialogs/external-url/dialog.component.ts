import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { environment } from 'environments/environment';
import { ExternalUrlDialog } from './models';
import { ExternalUrlDialogService } from './dialog.service';

@Component({
    selector: 'ij-external-url-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})
export class ExternalUrlDialogComponent extends BaseDialogComponent<ExternalUrlDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    private externalWebsite: string;

    constructor(el: ElementRef, private dialogSvc: ExternalUrlDialogService) {
        super(ExternalUrlDialog, el, null);
        
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(externalWebsite => {
            if(externalWebsite.indexOf('http') < 0){
                externalWebsite = 'http://' + externalWebsite;
            }
            this.externalWebsite = externalWebsite;
            this.showDialog();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }

    onAccept() {
        this.openExternalWindow(this.externalWebsite);
        this.hideDialog();
    }
}