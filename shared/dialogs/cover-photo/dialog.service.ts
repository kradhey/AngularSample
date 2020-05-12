import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export enum CoverPicDialogMode {
    Signup = 1,
    ExistingProfile = 2
}

@Injectable()
export class CoverPicDialogService {
    private showDialogSource = new Subject<CoverPicDialogMode>();
    showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(mode: CoverPicDialogMode) {
        this.showDialogSource.next(mode);
    }
}