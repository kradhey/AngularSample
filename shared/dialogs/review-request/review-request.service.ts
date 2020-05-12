import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { ReviewProfileDialog, ReviewProfileRequest } from '../review/models';
import { environment } from 'environments/environment';
import { ReviewRequest } from './models';

@Injectable()
export class ReviewRequestService {
    constructor (
        private http: HttpClient
    ) { }

    getReviewDialog(profileSysId: string): Observable<ReviewProfileDialog> {
        const url = environment.endpoints.profile.freelancer.reviewable(profileSysId);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetData(r));
    }

    requestReview(req: ReviewRequest): Observable<boolean> {
        const utils = new SiteApiResponseUtilities();
        const url = environment.endpoints.profile.freelancer.requestReview();

        return this.http
            .post(url, req)
            .map(r => true)
            .catch(r => utils.onServiceError(r));
    }

    private onGetData(response: ISiteApiResponse) {
        return response.data || {};
    }
}