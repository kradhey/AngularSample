import { Component, Input } from '@angular/core';

@Component({
    selector: 'ij-timeline-company',
    templateUrl: 'signup-timeline-company.component.html',
    styleUrls: ['timeline-company.less']
})
export class SignupTimeline2Component {
    @Input() step: number = 6;

    getStepClass(step: number) {
     
        const result = {
            "active": step == this.step,
            "completed": step < this.step
        };

        return result;
    }
}