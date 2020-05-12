import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseStepComponent, PortfolioCompanyStep } from './models';
import { patterns } from 'shared/view/regex-patterns';
import { SignupTermsDialogService } from '../terms-dialog/dialog.service';
import { PrivatePolicyDialogService } from '../private-policy-dialog/dialog.service';

@Component({
    selector: 'ij-portfolio-company-step',
    templateUrl: 'portfolio-company-step.component.html',
    styleUrls: ['portfolio-company-step.less']
})
export class PortfolioCompanyStepComponent extends BaseStepComponent {
    imdbRegex = patterns.imdb;
    urlRegex = patterns.url;
    @Input() model: PortfolioCompanyStep;

    constructor (
        router: Router, 
        private termSvc: SignupTermsDialogService, 
        private privatePolicySvc: PrivatePolicyDialogService
        ) {
            super(router);

            this.termSvc.acceptTerms$.subscribe(term => {
                this.acceptTerms = term;
            });

            this.privatePolicySvc.acceptTerms$.subscribe(term => {
                this.acceptTerms = term;
            });
    }

    showTermsDialog() {
        this.termSvc.showDialog();
    }

    showPrivatePolicyDialog() {
        this.privatePolicySvc.showDialog();
    }
}