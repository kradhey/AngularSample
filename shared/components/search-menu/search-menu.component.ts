
import { retry } from 'rxjs/operators/retry';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'ij-search-menu',
    templateUrl: './search-menu.component.html',
    styleUrls: ['./search-menu.less'],
})
export class SearchMenuComponent  {
    @Output() quickSearchEvent = new EventEmitter<string>();

    @Input("isWhiteColor")
    isWhiteColor: boolean;
    constructor (
        private authSvc: AuthService,
        private router: Router
    ) {}
    // get isLoggedIn() {
    //     return this.authSvc.isLoggedIn;
    // }
    onToggleQuickSearch() {
        this.quickSearchEvent.next();
    }
}