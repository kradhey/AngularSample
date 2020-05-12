import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchCardsRequest, SearchCardsResponse, SearchPage } from './models';
import { SearchCard, LocationType } from 'shared/components/search-card/models';
import { SearchService } from './search.service';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { environment } from 'environments/environment';

import { SiteHeaderComponent } from 'shared/components/site-header/site-header.component';
import { ISubscription } from 'rxjs/subscription';

@Component({
    selector: 'ij-search',
    templateUrl: 'search.component.html',
    styleUrls: ['./styles/search.less']
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
    page: SearchPage = new SearchPage();
    lastRequest: SearchCardsRequest = null;
    locationType = LocationType;
    get hasData() {
        return this.page != null && this.page.cards;
    }

    get showSummary() { 
        if (!this.hasData) {
            return false;
        }

        return !this.page.showFeaturedMembers;
    }

    get showWorkingCityResults(){
        if(this.page != null && this.page.cards){
           return this.page.cards.some((x)=>x.locationType == this.locationType.WorkingLocation)
        }
        return false;
    }
    
    get cardCount() { 
        if (this.page == null || this.page.cards == null) return 0;
        return this.page.cards.length; 
    }

    @ViewChild("siteHeader") siteHeader: SiteHeaderComponent;
    
    private initialized: boolean = false;
    private querySub: ISubscription;
    private routeSub: ISubscription;
    private cardsSub: ISubscription;
    
    constructor (
        public searchSvc: SearchService,
        private route: ActivatedRoute,
        private referDlg: ReferProfileDialogService
    ) { }
  
    ngOnInit() {
        this.routeSub = this.route.data.subscribe((data: { page: SearchPage }) => {
            window.scrollTo(0, 200);
            this.onPageLoad(data.page);
        });

        this.querySub = this.route.queryParams.subscribe(qps => {
            if (this.initialized) {
                if (Object.getOwnPropertyNames(qps).length === 0) {
                    location.reload();
                    return;
                }

                const req = SearchCardsRequest.FromRoute(this.route.snapshot);
                this.getCards(req);
            } 
        });
    }

    ngAfterViewInit(): void {
        this.initialized = true;
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }

        if (this.querySub) {
            this.querySub.unsubscribe();
        }

        if (this.cardsSub) {
            this.cardsSub.unsubscribe();
        }
    }

    onRefer($event) {
        this.referDlg.showDialog($event);
    }
    
    onViewMoreClicked() {
        let copy = <SearchCardsRequest>{};
        Object.assign(copy, this.lastRequest);

        copy.page = this.page.currentPage + 1;
        this.getCards(copy, false);
    }

    trackCard(card: SearchCard) {
        return card == null ? null : card.profileSysId;
    }

    private getCards(req: SearchCardsRequest, clear: boolean = true) {
        this.lastRequest = req;
        this.cardsSub = this.searchSvc.getCards(req).subscribe(r => this.onGetCardsSuccessful(r, clear), e => this.onGetCardsError(e));
    }

    private onGetCardsSuccessful(res: SearchCardsResponse, clear: boolean = true) {
        this.page.errored = false;
        this.page.showFeaturedMembers = false;
        this.page.currentPage = res.pager.current;

        this.page.pager = res.pager;
        this.page.request = res.request;

        if (clear) {
            this.page.cards = [];
        }

        SearchCard.SetProfileImageUrl(res.cards);
        this.page.cards.push(...res.cards);
    }

    private onPageLoad(page: SearchPage) {
        SearchCard.SetProfileImageUrl(page.cards);
        this.page = page;
        this.lastRequest = page.request;
    }

    private onGetCardsError(res: SearchCardsResponse) {
        this.page.errored = true;
    }
}