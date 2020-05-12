import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GalaryDialogService {
    private showDialogSource = new Subject<string[]>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(images:any[]) {
        this.showDialogSource.next(images);
    }
}