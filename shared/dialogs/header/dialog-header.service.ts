import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DialogHeader } from './DialogHeader';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class DialogHeaderService {
    constructor(
        private http: HttpClient
    ) { }

    getData(profileSysId: string): Observable<DialogHeader> {
        const url = environment.endpoints.profile.freelancer.card(profileSysId);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetData(r));
    }

    getSocialUserData(socialUserId: number): Observable<DialogHeader> {
        const url = environment.endpoints.profile.freelancer.socialUserCard(socialUserId);

        return this.http
            .get<ISiteApiResponse>(url)
            .map(r => this.onGetSocialUserData(r));
    }

    private onGetSocialUserData(response: ISiteApiResponse) {
        return response.data || {};
    }
    
    private onGetData(response: ISiteApiResponse) {
        return response.data || {};
    }
}