import { Component, Input } from '@angular/core';

@Component({
    selector: 'ij-timeline',
    templateUrl: 'signup-timeline.component.html',
    styleUrls: ['timeline.less']
})
export class SignupTimelineComponent {
    @Input() step: number = 1;

    getStepClass(step: number) {
    
        const result = {
            "active": step == this.step,
            "completed": step < this.step
        };

        return result;
    }
}