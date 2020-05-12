import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { VerifyFacebookDialog, ReviewFormData, ReviewRequestIdentifier } from './models';
import { environment } from 'environments/environment';
import { AuthService } from 'auth/auth.service';
import { ProjectCardResponse } from 'profile/models';

interface IExternalUserInfo {
    loginProvider: string,
    providerKey: string,
    userName: number,
    email: string,
    firstName: string,
    lastName: string
    imageUrl: number,
    gender: string,
    accessToken: string,
    location: ILocationInfo
}

interface ILocationInfo {
    id: string,
    name: string,
    state: string,
    city: string,
    country: string
}

@Injectable()
export class VerifyFacebookService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getReviewDialog(profileSysId: string): Observable<VerifyFacebookDialog> {
        let url = environment.endpoints.profile.freelancer.reviewable(profileSysId);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetData(r));
    }

    getProjectFromReviewRequestId(requestId: string): Observable<ProjectCardResponse> {
        let url = environment.endpoints.profile.freelancer.getProjectFromReviewRequestId(requestId);
        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetData(r));
    }

    saveProfileReview(profileSysId: string, form: ReviewFormData): Observable<boolean> {
        const utils = new SiteApiResponseUtilities();
        const url = environment.endpoints.profile.freelancer.review(profileSysId);

        return this.http
            .post(url, form)
            .map(r => true)
            .catch(r => utils.onServiceError(r));
    }

    saveFacebookReview(profileSysId: string, form: ReviewFormData): Observable<boolean> {
        const utils = new SiteApiResponseUtilities();
        const url = environment.endpoints.profile.freelancer.facebookReview(profileSysId);

        return this.http
            .post(url, form)
            .map(r => true)
            .catch(r => utils.onServiceError(r));
    }

    validateReview(req: ReviewRequestIdentifier) {
        const utils = new SiteApiResponseUtilities();
        const url =  environment.endpoints.profile.freelancer.validateReviewRequest;

        return this.http
            .post<ISiteApiResponse>(url, req)
            .map(r => this.onGetData(r))
            .catch(r => utils.onServiceError(r));
    }

    private onGetData(response: ISiteApiResponse) {
        return response.data || {};
    }
}