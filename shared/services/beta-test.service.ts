import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';

@Injectable()
export class BetaTestService {
    constructor (
        private http: HttpClient
    ) { }

    mobileSignup(email: string): Observable<boolean> {
        const body = {
            email
        };

        return this.http.post(environment.endpoints.beta.mobileRequest, body)
            .map(r => true)
            .catch(r => this.onError(r));
    }

    private onError(error): Observable<boolean> {
        return Observable.of(false)
    }
}