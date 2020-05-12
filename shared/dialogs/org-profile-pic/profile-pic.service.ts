import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class OrgProfilePicService {
    constructor (
        private http: HttpClient
    ) { }

    uploadProfilePicture(image: any) {
        debugger
        const url = environment.endpoints.organization.profileImage;
        let username=localStorage.getItem("userOrganisation")
        const params = new HttpParams()
            .set("payload", image)
            .set("username",username)

        const headers = new HttpHeaders()
            .set("Content-Type", "application/x-www-form-urlencoded");

        return this.http
            .post<ISiteApiResponse>(url, params, {headers})
            .map(r => this.onGetSuccessful(r));
    }

    private onGetSuccessful(response: ISiteApiResponse) {
        return response.data || null;
    }
}