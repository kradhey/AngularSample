import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExternalUrlDialogService {
    private showDialogSource = new Subject<string>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(externalWebsite: string) {
        this.showDialogSource.next(externalWebsite);
    }
}