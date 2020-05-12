import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ContestReviewDialogResponse } from './models';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class ContestReviewService {
    constructor (
        private http: HttpClient
    ) { }

    getContest(reviewId: number, reviewType: number): Observable<ContestReviewDialogResponse> {
        const url = environment.endpoints.profile.freelancer.contest(reviewId, reviewType);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetData(r));
    }

    sendContest(reviewId: number, body: any): Observable<boolean> {
        const url = environment.endpoints.profile.freelancer.contest(reviewId);
        return this.http
            .post(url, body)
            .map(r => true);
    }

    private onGetData(response: ISiteApiResponse) {
        return response.data || {};
    }
}