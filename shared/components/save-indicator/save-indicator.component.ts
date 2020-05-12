import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'ij-save-indicator',
    templateUrl: './save-indicator.component.html',
    styleUrls: ['./styles.less'],
})
export class SaveIndicator {
    private _visible: boolean = false;
    
    @Input("title")
    public title: string = "Success!";

    @Input("message")
    public message: string = "Your changes have been saved."

    @Input("visible")
    public set visible(v: boolean) {
        this.display = v ? "block" : "none";

        setTimeout(() => {
            this._visible = v;
        }, 0);
    }

    public get visible() {
        return this._visible;
    }

    @HostBinding("style.display")
    public display: string = "none";

    constructor() {

    }
}