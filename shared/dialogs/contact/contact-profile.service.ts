import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { ISiteApiResponse, SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';

@Injectable()
export class ContactProfileService {
    constructor (
        private http: HttpClient
    ) { }

    sendMessage(profileSysId: string, message: string) {
        const utils = new SiteApiResponseUtilities();
        const url = environment.endpoints.profile.freelancer.contact(profileSysId);
        const body = {
            "message": message
        };

        return this.http
            .post<ISiteApiResponse>(url, body)
            .map(r =>  this.onGet(r))
            .catch(r => utils.onServiceError(r));
    }

    private onGet(response: ISiteApiResponse) {
        return response.data || {};
      }
}