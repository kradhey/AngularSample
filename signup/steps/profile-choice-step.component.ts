import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileType, ProfileChoiceStep, BaseStepComponent } from './models';

@Component({
    selector: "ij-su-profile-choice-step",
    templateUrl: "profile-choice-step.component.html",
    styleUrls: ["profile-choice-step.less"]
})
export class ProfileChoiceStepComponent extends BaseStepComponent {
    @Input() model: ProfileChoiceStep;

    constructor (router: Router) {
        super(router);
        
    }
    
    onFreelancer() {
        // this.model.type = ProfileType.Freelancer;
        super.next();
    }

    onCompany() {
        // this.model.type = ProfileType.ProductionCompany;
        super.nextStep();
    }
}