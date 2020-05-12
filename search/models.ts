import { ActivatedRouteSnapshot } from '@angular/router';
import { SearchCard } from '../shared/components/search-card/models';

export const DefaultPageSize: number = 15;

export class SearchPage {
    public cards: SearchCard[];
    public pager: PagerResponse;
    public request: SearchCardsRequest;

    public errored: boolean = false;
    public currentPage: number = 1;
    public showFeaturedMembers: boolean = false;
}

export class SearchCardsRequest {
    constructor(
        public crewRole: string,
        public budget: string,
        public location: string,
        public organizationName: string,
        public page: number,
        public pageSize: number
    ) { }

    public get isComplete(): boolean {
        return this.crewRole != null && this.budget != null && this.location != null;
    }

    public static FromRoute(route: ActivatedRouteSnapshot): SearchCardsRequest {
        let budget = route.queryParamMap.get('budget');
        let location = route.queryParamMap.get('location');
        let role = route.queryParamMap.get('role');
        let organizationName = route.queryParamMap.get('organizationName');
        let page = +route.queryParamMap.get('page') || 1;
        let pageSize = +route.queryParamMap.get('pageSize') || DefaultPageSize;
        return new SearchCardsRequest(role, budget, location, organizationName, page, pageSize);
    }
}

export class SearchCardsResponse {
    public cards: SearchCard[];
    public pager: PagerResponse;
    public request: SearchCardsRequest;
}

export class PagerResponse {
    public pages: number;
    public current: number;
    public pageSize: number;
    public totalResults: number;
    public hasMore: boolean;
}