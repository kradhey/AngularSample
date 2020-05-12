import { Component, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { QuickSearchItem } from './QuickSearchItem';
import { QuickSearchService } from './quick-search.service';

import { environment } from 'environments/environment';
import { ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'ij-quick-search',
    templateUrl: './quick-search.component.html',
    styleUrls: ['./styles.less']
})
export class QuickSearchComponent implements OnInit, OnDestroy {
    public suggestions: QuickSearchItem[] = [];
    public input: string = null;
    
    private sub: ISubscription;
    private qs$ = new Subject<string>();
    
    @Output() onSelected = new EventEmitter<string>();
    @ViewChild("autocomplete") autocomplete;
    
    constructor (
        private router: Router,
        private quickSvc: QuickSearchService
    ) {
    }

    ngOnInit() {
        this.sub = this.qs$
            .debounceTime(300)
            .switchMap(query => this.quickSvc.getQuickSearch(query))
            .subscribe(matches => {
                for (const match of matches) {
                    if (match.thumbnailImageName) {
                        match.thumbnailImageUrl = environment.site.imageUrl(match.thumbnailImageName);
                    }
                    else {
                        match.thumbnailImageUrl = "/assets/images/avatars/avatar-sm.png";
                    }
                }

                this.suggestions = matches;
            });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    show() {
        setTimeout(() => {
            this.input = null;
          
            if (this.autocomplete) {
                this.autocomplete.domHandler.findSingle(this.autocomplete.el.nativeElement, 'input').focus();
            }
        }, 0);
    }

    onKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();
        this.qs$.next(query);
    }

    onSelect(item: QuickSearchItem) {
        if (item == null || item.profileSysId == null) {
            return;
        }
        this.router.navigate(['/profile', item.userProfileUrlDisplayName]);
        this.onSelected.emit(item.profileSysId);
    }
}