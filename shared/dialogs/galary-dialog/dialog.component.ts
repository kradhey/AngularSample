import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { environment } from 'environments/environment';
import { GalaryDialog } from './models';
import { GalaryDialogService } from './dialog.service';

@Component({
    selector: 'ij-galary-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})
export class GalaryDialogComponent extends BaseDialogComponent<GalaryDialog> implements OnDestroy {
    private dialogSub: ISubscription;
    public images =[];
    constructor(el: ElementRef, private dialogSvc: GalaryDialogService) {
        super(GalaryDialog, el, null);
       

           
        this.dialogSub = this.dialogSvc.showDialog$.subscribe((r) => {
           debugger;
            this.images =[]; 
            let counter=0;
             r.forEach(x=>
            {
                counter=counter+1;
                this.images.push({source:x,title:counter});
            })
          
            this.showDialog();
        });
 

    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }

    onAccept() {
        this.hideDialog();
    }
}