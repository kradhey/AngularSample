import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PrivatePolicyDialogService {
    private showDialogSource = new Subject<string>();
    public showDialog$ = this.showDialogSource.asObservable();
    private acceptTermSource = new Subject<boolean>();
    public acceptTerms$ = this.acceptTermSource.asObservable();
    
    showDialog() {
        this.showDialogSource.next();
    }

    acceptTerm(value: boolean){
        this.acceptTermSource.next(value);
    }
}