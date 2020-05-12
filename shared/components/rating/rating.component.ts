import { Component, Input } from '@angular/core';

@Component({
    selector: 'ij-rating',
    styleUrls: ['./rating.less'],
    templateUrl: './rating-component.html'
})
export class RatingComponent {
    stars: string[] = [];
    private _rating: number = 0;
    
    @Input("rating")
    set rating(v) { this._rating = v; this.onRatingChanged(); }
    get rating() { return this._rating; }

    @Input("label") public label: string = null;

    private onRatingChanged() {
        let temp = [
            "none-star",
            "none-star",
            "none-star",
            "none-star",
            "none-star"
        ];

        if (this.rating > 0) {
            const floor = Math.floor(this.rating);
            const remainder = this.rating - floor;

            let i = 0;
            for (; i < floor; i++) {
                temp[i] = "whole-star";
            }

            if (remainder > 0) {
                temp[i] = "half-star";
            }
        }

        this.stars = temp;
    }
}