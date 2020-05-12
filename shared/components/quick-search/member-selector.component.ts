import { Component, ViewChild, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { QuickSearchItem } from './QuickSearchItem';
import { QuickSearchService } from './quick-search.service';

import { environment } from 'environments/environment';
import { ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { debug } from 'util';
import { AuthService } from 'auth/auth.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'ij-member-selector',
    templateUrl: './member-selector.component.html',
    styleUrls: ['./styles.less']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {
    public suggestions: QuickSearchItem[] = [];
    public selected: string[] = [];

    private sub: ISubscription;
    private qs$ = new Subject<string>();

    @Input() forceSelection: boolean = true;
    @Input() multipleSelection: boolean = true;
    @Input() required: boolean = false;
    @Input("preventSelf") preventSelf: boolean = false;
    @Input("skipProfileSysId") skipProfileSysId: string = null;
    

    @ViewChild("autocomplete") autocomplete;
    @Output() componentHasValue: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private router: Router,
        private quickSvc: QuickSearchService,
        private authSvc: AuthService
    ) { }

    ngOnInit() {
        this.sub = this.qs$
            .debounceTime(300)
            .switchMap(query => this.quickSvc.getQuickSearch(query))
            .subscribe(matches => {
                for (const match of matches) {
                    // set profile image
                    if (match.thumbnailImageName) {
                        match.thumbnailImageUrl = environment.site.imageUrl(match.thumbnailImageName);
                    }
                    else {
                        match.thumbnailImageUrl = "/assets/images/avatars/avatar-sm.png";
                    }
                }

                // prevent self from showing in dropdown , Also prevents the profile which is being viewed
                if (this.preventSelf && matches && matches.length > 0) {
                    if (this.skipProfileSysId != null) {
                        matches = matches.filter(m => m.profileSysId != this.authSvc.profileSysId
                            && m.profileSysId != this.skipProfileSysId);
                    }
                    else {
                        matches = matches.filter(m => m.profileSysId != this.authSvc.profileSysId);
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

    onKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();
        this.qs$.next(query);
    }

    focus() {
        this.autocomplete.domHandler.findSingle(this.autocomplete.el.nativeElement, 'input').focus();
    }

    onSelect(event) {
        this.componentHasValue.emit(true);
    }

    onClear(event) {
        this.componentHasValue.emit(this.selected.length > 1);
    }
}