import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ij-see-more',
    templateUrl: 'see-more.html',
    styleUrls: ['./see-more.less']
})
export class SeeMoreComponent {
    public showSeeMore: boolean = false;
    
    @Input("data") public data: string[] = [];
    @Input("max") public max: number = 3;
    @Input("separator") public separator: string = ", ";
    @Input("no-data-message") public noDataMessage = null;
    @Input("more-data-message") public moreDataMessage = null;

    @Output() onSeeMoreClicked = new EventEmitter();

    public get output() {
        if (this.data == null || this.data.length == 0) {
            this.showSeeMore = false;
            return this.noDataMessage;
        }
        
        this.showSeeMore = this.data.length > this.max;
        return this.data.slice(0, this.max).join(this.separator);
    }

    public onSeeMore() {
        this.onSeeMoreClicked.emit();
    }
}