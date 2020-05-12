import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[ij-focus]'
})
export class FocusDirective {
    @Input('ij-focus')
    set focus(focused: boolean) {
        if (focused) {
            this.el.nativeElement.focus();
        }
    }

    constructor (public el: ElementRef) { }
}