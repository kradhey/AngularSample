import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { ReviewProfileDialog, ReviewProfileRequest } from './models';
import { environment } from 'environments/environment';

@Injectable()
export class ReviewProfileService {
    constructor (
        private http: HttpClient
    ) { }

    getReviewDialog(profileSysId: string): Observable<ReviewProfileDialog> {
        const url = environment.endpoints.profile.freelancer.reviewable(profileSysId);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetData(r));
    }

    saveReview(profileSysId: string, req: ReviewProfileRequest): Observable<boolean> {
        const utils = new SiteApiResponseUtilities();
        const url = environment.endpoints.profile.freelancer.review(profileSysId);

        return this.http
            .post(url, req)
            .map(r => true)
            .catch(r => utils.onServiceError(r));
    }

    private onGetData(response: ISiteApiResponse) {
        return response.data || {};
    }
}