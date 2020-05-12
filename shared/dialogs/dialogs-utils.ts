declare var $;

import { ElementRef } from '@angular/core';

export function scrollTop(el: ElementRef) {
    setTimeout(() => {
        let $dlg = $(el.nativeElement);
        let $wrapper = $dlg.find(".ui-dialog");
        let $content = $dlg.find(".ui-dialog-content");

        $wrapper.scrollTop(0);
        $content.scrollTop(0);
    }, 0);
}