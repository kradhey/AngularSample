import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ErrorDialog } from './models';

@Injectable()
export class ErrorDialogService {
    private showDialogSource = new Subject<ErrorDialog>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(data: ErrorDialog) {
        this.showDialogSource.next(data);
    }
}