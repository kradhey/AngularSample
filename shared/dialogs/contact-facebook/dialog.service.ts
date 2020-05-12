import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SocialUser } from 'login/models';

@Injectable()
export class ContactFacebookDialogService {
    private showDialogSource = new Subject<any>();
    public showDialog$ = this.showDialogSource.asObservable();

    showDialog(socialUserId: number, connection: any) {
        let model = {
            socialUserId: socialUserId,
            connection: connection
        }
        this.showDialogSource.next(model);
    }
}