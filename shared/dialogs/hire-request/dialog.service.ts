import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HireRequestProfileDialogService {
    private showDialogSource = new Subject<string>()
    public showDialog$= this.showDialogSource.asObservable();
  
    showDialog(profileSysId: string) {
        this.showDialog$ = this.showDialogSource.asObservable();
        this.showDialogSource.next(profileSysId);
    }
}