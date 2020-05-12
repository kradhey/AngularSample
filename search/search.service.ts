import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SearchCardsRequest, SearchCardsResponse } from './models';
import * as httputils from 'shared/angular/http';

import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class SearchService {
    constructor (
        private http: HttpClient
    ) { }

    getCards(request: SearchCardsRequest): Observable<SearchCardsResponse> {
        const url = environment.endpoints.search.cards;
        const params = httputils.toHttpParams(request);
        return this.http
            .get<ISiteApiResponse>(url, { params })
            .map(r => this.onGetCards(r));
    }

    getFeaturedMembers(crewRole: string): Observable<SearchCardsResponse> {
        const url = environment.endpoints.search.featured(crewRole);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetCards(r));
    }

    private onGetCards(response: ISiteApiResponse) {
        return response.data || {};
    }
}