import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseStepComponent, PortfolioStep } from './models';
import { patterns } from 'shared/view/regex-patterns';
import { SignupTermsDialogService } from '../terms-dialog/dialog.service';
import { PrivatePolicyDialogService } from '../private-policy-dialog/dialog.service';
@Component({
    selector: 'ij-portfolio-step',
    templateUrl: 'portfolio-step.component.html',
    styleUrls: ['portfolio-step.less']
})
export class PortfolioStepComponent extends BaseStepComponent {
    public imdbRegex = patterns.imdb;
    public urlRegex = patterns.url;
    @Input() model: PortfolioStep;

    constructor(router: Router, private termSvc: SignupTermsDialogService, private privatePolicySvc: PrivatePolicyDialogService  ) {
        super(router);
        this.termSvc.acceptTerms$.subscribe(term => {
            this.acceptTerms = term;
        });
        this.privatePolicySvc.acceptTerms$.subscribe(term => {
            this.acceptTerms = term;
        });
    }

    onFileRemove(input, name) {
        if (input) {
            input.value = '';
        }

        if (name == "resume") {
            this.model.resume = null;
        }
        else if (name == "gear") {
            this.model.gear = null;
        }
    }

    onFileChange(event, name) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            if (name == "resume") {
                this.model.resume = file;
            }
            else if (name == "gear") {
                this.model.gear = file;
            }
        }
    }

    showTermsDialog() {
        this.termSvc.showDialog();
    }

    showPrivatePolicyDialog() {
        this.privatePolicySvc.showDialog();
    }

}