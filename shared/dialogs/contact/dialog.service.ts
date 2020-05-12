import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ContactProfileDialogService {
    private showDialogSource = new Subject<any>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(profileSysId: string, connection: any) {
        let model = {
            profileSysId: profileSysId,
            connection: connection
        }
        this.showDialogSource.next(model);
    }
}