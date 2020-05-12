import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
const DefaultColor: string = '#4392EF';

@Injectable()
export class ProgressColorService {
    private changed = new Subject<string>();
    private _color: string = DefaultColor;

    changed$ = this.changed.asObservable();

    get color(): string {
        return this._color;
    }

    set color(v: string) {
        this._color = v;
        this.changed.next(v);
    }

    reset() {
        this.color = DefaultColor;
    }
}