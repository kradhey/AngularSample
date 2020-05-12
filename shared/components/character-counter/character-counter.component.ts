import { Component, Input } from '@angular/core';

@Component({
    selector: 'ij-character-counter',
    templateUrl: 'character-counter.component.html',
    styleUrls: ['./styles.less']
})
export class CharacterCounterComponent {
    size: string = null;

    @Input("element")
    element: HTMLTextAreaElement;
}