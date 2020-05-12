import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export enum BehindScenePicDialogMode {
    Signup = 1,
    ExistingProfile = 2
}

@Injectable()
export class BehindScenePicDialogService {
    private showDialogSource = new Subject<BehindScenePicDialogMode>();
    showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(mode: BehindScenePicDialogMode) {
        this.showDialogSource.next(mode);
    }
}