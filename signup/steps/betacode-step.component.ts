import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BetaCodeStep, BaseStepComponent } from './models';
import { SignupService } from '../signup.service';

@Component({
    selector: 'ij-betacode-step',
    templateUrl: 'betacode-step.component.html',
    styleUrls: ['betacode-step.less']
})
export class BetaCodeStepComponent extends BaseStepComponent {
    @Input() model: BetaCodeStep;
    public badCode: boolean = false;

    constructor (
        router: Router,
        private signupService: SignupService
    ) {
        super(router);
    }

    onNext(form: any) {
        if (!super.validate(form)) {
            return;
        }

        this.signupService.isBetaCodeValid(this.model.betaCode)
            .subscribe(r => {
                this.badCode = false;
                super.next();
            }, e => {
                this.badCode = true;
            });
    }
}