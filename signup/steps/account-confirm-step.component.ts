import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ij-account-confirm-step',
    templateUrl: 'account-confirm-step.component.html',
    styleUrls: ['account-confirm-step.less']
})
export class AccountConfirmStepComponent {
    constructor (
        private router: Router
    ) { }

    onFinish(){
        this.router.navigate(['/']);
    }
}