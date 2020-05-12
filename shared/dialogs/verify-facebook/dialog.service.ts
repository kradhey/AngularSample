import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ReviewRequestIdentifier } from './models';

@Injectable()
export class VerifyFacebookDialogService {
    private showDialogSource = new Subject<ReviewRequestIdentifier>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(dialogSource: ReviewRequestIdentifier) {
        this.showDialogSource.next(dialogSource);
    }
}