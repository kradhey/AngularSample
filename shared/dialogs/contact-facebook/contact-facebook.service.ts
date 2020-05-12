import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

@Injectable()
export class ContactFacebookService {
    constructor(
        private http: HttpClient
    ) { }

    sendMessage(message: string, socialUserId: number, profileSysyId: string ): Observable<boolean> {
        const url = environment.endpoints.profile.freelancer.contactFacebook();
        const body = {
            "message": message,
            "socialUserId": socialUserId,
            "profileSysId": profileSysyId
        };

        return this.http
            .post(url, body)
            .map(r => true);
    }
}