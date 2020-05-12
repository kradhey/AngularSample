import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HireProfileRequest, HireProfileRequestDisplay } from './models';
import { environment } from 'environments/environment';

@Injectable()
export class HireRequestProfileService {
    constructor (
        private http: HttpClient
    ) { }

    hireProfile(profileSysId: string, req: HireProfileRequest): Observable<boolean> {
        const url = environment.endpoints.profile.freelancer.hire(profileSysId);

        return this.http
            .post(url, req)
            .map(r => true);
    }

    hireRequestResponse(hireId: number, response:string, model: HireProfileRequestDisplay):Observable<boolean> {
        const url = environment.endpoints.profile.freelancer.hireProfileResponse(hireId,response);

        return this.http
            .post(url, model)
            .map(r => true);
    }
}