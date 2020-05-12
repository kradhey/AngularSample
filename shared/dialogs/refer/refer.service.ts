import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReferRequest } from './models';
import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class ReferService {
    constructor (
        private http: HttpClient
    ) { }

    refer(profileSysId: string,req: ReferRequest): Observable<boolean> {
        const utils = new SiteApiResponseUtilities();
        const url = environment.endpoints.profile.freelancer.refer(profileSysId);

        return this.http
            .post<ISiteApiResponse>(url, req)
            .map(r =>  this.onGet(r))
            .catch(r => utils.onServiceError(r));
    }

    private onGet(response: ISiteApiResponse) {
        return response.data || {};
      }
}