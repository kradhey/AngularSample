import { Component, Input } from '@angular/core';

@Component({
    selector: 'ij-industry-score',
    templateUrl: 'industry-score.component.html',
    styleUrls: ['./styles.less']
})
export class IndustryScoreComponent {
    size: string = null;

    @Input("color")
    color: string = "#fff";

    private _score: number = 0;
    get score() { return this._score; }

    @Input("score")
    set score(v: number) {
        this._score = v;

        if (v == 100) {
            this.size = "small";
        }
        else {
            this.size = "large";
        }
    }

    @Input("showAnimation")
    showAnimation: boolean = false;
}