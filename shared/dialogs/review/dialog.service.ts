import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReviewProfileDialogService {
    private showDialogSource = new Subject<string>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(profileSysId: string) {
        this.showDialogSource.next(profileSysId);
    }
}