import { Component, Input } from '@angular/core';
import { DialogHeader } from './DialogHeader';

@Component({
    selector: 'ij-dialog-header',
    templateUrl: 'dialog-header.component.html',
    styleUrls: ['styles.less']
})
export class DialogHeaderComponent {
    @Input()
    public model: DialogHeader;
}