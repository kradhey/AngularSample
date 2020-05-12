import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HireProfileDialogService {
  private showDialogSource = new Subject<string>();
  public showDialog$ = this.showDialogSource.asObservable();

  constructor() {
    console.log('inject service');
  }

  showDialog(profileSysId: string) {
    this.showDialogSource.next(profileSysId);
  }
}
