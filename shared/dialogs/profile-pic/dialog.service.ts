import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export enum ProfilePicDialogMode {
    Signup = 1,
    ExistingProfile = 2
}

@Injectable()
export class ProfilePicDialogService {
    private showDialogSource = new Subject<ProfilePicDialogMode>();
    showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(mode: ProfilePicDialogMode) {
        this.showDialogSource.next(mode);
    }
}