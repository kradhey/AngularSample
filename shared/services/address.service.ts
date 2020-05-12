import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as httputils from 'shared/angular/http';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';

export interface IValidCityRequest {
    city: string;
    state: string;
    // zipcode: string;
    "auth-id"?: string;
}

@Injectable()
export class AddressService {
    constructor (
        private http: HttpClient
    ) { }

    isValidCity(request: IValidCityRequest): Observable<boolean> {
        const url = environment.endpoints.address.zipCode;
        request["auth-id"] = environment.endpoints.address.authId;
        const params = httputils.toHttpParams(request);

        return this.http
            .get(url, { params })
            .map(r => this.onMapValidCity(r));
    }

    private onMapValidCity(response) {
        if (!response) return false;
        if (response.length == 0) return false;
        
        if (response[0].status) {
            return false;
        }

        return true;
    }
}