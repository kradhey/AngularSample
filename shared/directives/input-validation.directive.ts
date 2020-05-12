declare var $: any;

import { 
    Directive, 
    ElementRef, 
    HostListener, 
    Input, 
    Renderer2, 
    OnDestroy, 
    EventEmitter } from '@angular/core';

import { NgModel, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: '[ij-input-validation]',
    host: {
        "data-toggle": "tooltip",
        "data-placement": "top",
    }
})
export class InputValidationDirective implements OnDestroy {
    private html = '<div class="tooltip ij-input-invalid-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
    private handler: ValidationHandler;
    private submitSubscription: EventEmitter<{}>;
    private statusSubscription: Subscription;

    @Input('ij-input-validation')
    set title(v: string) {
        if (this.ready) {
            this.handler.hostEl.title = v;
        }
    }

    get title(): string {
        if (this.ready) {
            return this.handler.hostEl.title;
        }
    }

    get ready() {
        return this.handler != null && this.handler.ready;
    }

    get shouldShowTooltip() {
        if (this.ngModel.invalid
            && (this.ngModel.touched || !this.ngModel.touched && this.ngForm.submitted)
            && this.ready) {
            return this.handler.shouldShowTooltip;
        }
        return false;
    }

    private get formEl(): HTMLFormElement {
        return $(this.handler.hostEl).closest('form')[0];
    }

    constructor (
        public el: ElementRef,
        private ngModel: NgModel,
        private ngForm: NgForm,
        private renderer: Renderer2
    ) {
        this.handler = this.selectHandler(this.el);
        
        this.submitSubscription = this.ngForm.ngSubmit.subscribe(r => {
            if (this.ngForm.invalid) {
                this.renderer.addClass(this.formEl, 'ij-submitted-invalid');
            }
            else {
                this.renderer.removeClass(this.formEl, 'ij-submitted-invalid');
            }
        });

        this.statusSubscription = this.ngModel.statusChanges.subscribe(r => {
            if (r === "VALID") {
                this.hideTooltip();
            }
        });

        if (this.ready) {
            this.renderer.addClass(this.handler.hostEl, 'ij-input');
        }
     }

    ngOnDestroy() {
        this.submitSubscription.unsubscribe();
        this.statusSubscription.unsubscribe();
    }

    @HostListener('focusin')
    showTooltip() {
        if (this.shouldShowTooltip) {
            $(this.handler.hostEl).tooltip({template: this.html, trigger: 'manual'});
            $(this.handler.hostEl).tooltip('show');
        }
    }

    @HostListener('focusout')
    hideTooltip() {
        if (this.ready) {
            $(this.handler.hostEl).tooltip('hide')
        }
    }

    private selectHandler(el: ElementRef): ValidationHandler {
        let validator: ValidationHandler = null;

        switch (el.nativeElement.tagName) {
            case "P-AUTOCOMPLETE":
                validator = new ValidationHandler();
                break;
            default:
                validator = new HTMLFormElementHandler();
                break;
        }

        if (validator) {
            validator.setup(el);
        }
        
        return validator;
    }
}

class ValidationHandler {
    public hostEl: HTMLElement;
    public get ready(): boolean { return this.hostEl != null; }
    public get shouldShowTooltip(): boolean { return true; }

    public setup(el: ElementRef): void {
        this.hostEl = el.nativeElement;
    }
}

class HTMLFormElementHandler extends ValidationHandler {
    get shouldShowTooltip() {
        return this.hostEl == document.activeElement;
    }
}