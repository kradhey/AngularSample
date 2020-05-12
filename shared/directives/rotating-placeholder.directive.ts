import { Directive, ElementRef, Renderer, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Directive({
    selector: '[ij-rotating-placeholder]'
})
export class RotatingPlaceholderDirective {
    private row: number = 0;
    private col: number = 0;

    private _sub: Subscription;
    private _timer: Observable<number>;

    private _placeholders: string[];

    @Input("ij-rotating-placeholder") set placeholders(input: string[]) {
        this._placeholders = input;
    }

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    ngAfterViewInit() {
        this.clearPlaceholder();
        this.startTimer();
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    private onTick(t: number) {
        let item = this._placeholders[this.row];
        let char = item[this.col];

        this.el.nativeElement.placeholder += char;
        this.advanceCharacter(item);
    }

    private startTimer() {
        this._timer = TimerObservable.create(1000, 300);
        this._sub = this._timer.subscribe(t => this.onTick(t));
    }

    private stopTimer() {
        this._sub.unsubscribe();
    }

    private clearPlaceholder() {
        this.el.nativeElement.placeholder = "";
    }

    private advanceCharacter(item) {
        // next placeholder element
        if (this.col >= item.length) {
            this.col = 0;
            this.row++;
            this.clearPlaceholder();
        }
        // next character
        else {
            this.col++;
        }

        // startover
        if (this.row >= this._placeholders.length) {
            this.row = 0;
            this.col = 0;
            this.clearPlaceholder();
        }
    }
}