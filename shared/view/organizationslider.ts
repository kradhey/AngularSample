declare var $;

import { ElementRef } from '@angular/core';

export function slide(el: ElementRef) {
    $('.carousel').carousel({
        interval: 5000
    });
    $('.carousel').carousel('cycle');
}