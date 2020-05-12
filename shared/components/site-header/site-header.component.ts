import { OnInit, Component, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { ISubscription } from 'rxjs/Subscription';

import { SearchCriteria } from './models';
import { LookupService } from 'shared/services/lookup.service';
import { Budget } from 'shared/services/budget'
import { CrewRole } from 'shared/services/CrewRole';
import { Cities } from 'shared/services/Cities'
import { AuthService } from 'auth/auth.service';
import * as utils from 'shared/lang/object';

import 'rxjs/add/operator/first';
import { Organizations } from 'shared/services/Organizations';
import { debounce } from 'rxjs/operator/debounce';
import * as places from 'places.js';
import { WorkingCity } from 'profile/settings/models';
import { Address } from '../../../../node_modules/ngx-google-places-autocomplete/objects/address';
@Component({
    selector: 'ij-site-header',
    templateUrl: 'site-header.component.html',
    styleUrls: ['./site-header.less'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 }))
            ])
        ])],
    providers: [ConfirmationService]
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
    budgets: string[];
    locations: string[];
    allBudgets: Budget[] = [];
    allOrganizations: Organizations[] = [];
    allBudgetSuggestions: string[];
    allOrganizationSuggestions: string[];
    roles: string[] = [];
    placeholders: string[] = [];

    allCities: Cities[] = [];
    allCitiesSuggestions: string[];

    model = new SearchCriteria();
    isTrue: boolean = false;
    budget: boolean = true;
    city: boolean = true
    counter: number = 0;
    minusBtn: boolean = true;
    showQuickSearch: boolean = false;
    roleHasFocus: boolean = false;
    submitted: boolean = false;
    searchByOrganization: boolean = true;
    showSearchForm: boolean;
    @ViewChild("quicksearch") quicksearch;
    @Input("mode") public mode: "full" | "mini" = "full";
    @Input("title") public title: string = null;
    @Input("menuWhiteColor") menuWhiteColor: boolean;

    private rolesSub: ISubscription;
    private placesAutocomplete: any;
    public get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    constructor(
        private lookupSvc: LookupService,
        private confirmSvc: ConfirmationService,
        private authSvc: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.placeholders = [
            "1st Assistant Camera",
            "Producer",
            "Director",
            "Editor",
            "Production Designer"
        ];
        this.showSearchForm = true;
    }

    ngOnInit() {


    }

    ngOnDestroy() {
        if (this.rolesSub) {
            this.rolesSub.unsubscribe();
        }
    }


    onToggleQuickSearch() {
        this.showQuickSearch = !this.showQuickSearch;

        setTimeout(() => {
            if (this.showQuickSearch) {
                this.quicksearch.show();
            }
        }, 0);
    }



}
