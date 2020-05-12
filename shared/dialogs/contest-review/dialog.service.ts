import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ContestReviewDialogService {
    private showDialogSource = new Subject<any>();
    showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(review: any) {
        this.showDialogSource.next(review);
    }
}