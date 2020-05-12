import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ConfirmationDialog } from './models';

@Injectable()
export class ConfirmationDialogService {
    private showDialogSource = new Subject<ConfirmationDialog>();
    private hideDialogSource = new Subject<boolean>();
    public showDialog$ = this.showDialogSource.asObservable();
    public hideDialog$ = this.hideDialogSource.asObservable();
    
    showDialog(externalWebsite?: ConfirmationDialog) {
        this.showDialogSource.next(externalWebsite);
    }

    hideDialog(data: boolean) {
        this.hideDialogSource.next(data);
    }
}