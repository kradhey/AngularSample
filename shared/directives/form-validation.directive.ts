import { Directive, ElementRef, Renderer2, OnDestroy } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    selector: 'form[ij-form-validation]'
})
export class FormValidationDirective implements OnDestroy {
    private statusSubscription: Subscription;

    constructor (
        public el: ElementRef,
        private ngForm: NgForm,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.statusSubscription = this.ngForm.statusChanges.subscribe(r => {
            if (r === "VALID") {
                setTimeout(() => {
                    this.renderer.removeClass(this.el.nativeElement, 'ij-submitted-invalid');
                }, 0);
            }
        });
    }

    ngOnDestroy() {
        this.statusSubscription.unsubscribe();
    }
}