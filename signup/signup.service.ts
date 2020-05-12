import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';

import { SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { constants } from 'environments/constants';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class BetaRequest {
    public firstName: string;
    public lastName: string;
    public email: string;
    public city: string;
    public state: string;
    public zipcode: string;
    public roles: string[];
    public country: string;
}

export class SignupRequest {
    public betaCode: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public roles: string[];
    public phone: string;
    public city: string;
    public state: string;
    public gender: string;
    public zipCode: string;
    public password: string;
    public confirmPassword: string;
    public profilePic: string;
    public imdb: string;
    public personalWebSite: string;
    public reel: string;
    public gear: any;
    public resume: any;
    public fullName: string;
    public address: string;
    public dOB: string;
    public addressLine1: string;
    public addressLine2: string;
    public aptSte: string;
    public county: string;
    public province: string;
    public country: string;
    public countryCode: string;
    public stateCode: string;
    public latitude: any;
    public longitude: any;
}

export class CompanySignupRequest {
    public betaCode: string;
    public companyName: string;
    public companyEmail: string;
    public companyPhone: string;
    public companyRole: string;
    public imdb: string;
    public companyWebSite: string;
    public companyReel: string;
    public password: string;
    public confirmPassword?: string;
    public city: string;
    public state: string;
    public zipCode: string;
    public companyPic: string;
    public countryCode: string;
    public stateCode: string;
    public addressLine1: string;
    public addressLine2: string;
    public aptSte: string;
    public county: string;
    public province: string;
    public country: string;
    public latitude: any;
    public longitude: any;
}

@Injectable()
export class SignupService {
    private respUtils = new SiteApiResponseUtilities();

    constructor(
        private http: HttpClient,

    ) {
        this.keyHeaders = new Headers();
    }

    isBetaCodeValid(code: string): Observable<boolean> {
        const url = environment.endpoints.beta.validateCode(code);
        return this.http.get(url).map(r => true);
    }

    betaRequest(req: BetaRequest) {
        const url = environment.endpoints.beta.siteRequest;

        return this.http
            .post(url, req)
            .map(r => true)
            .catch(e => this.respUtils.onServiceError(e));
    }

    signup(request: SignupRequest) {
        const url = environment.endpoints.signup.freelancer;
        const headers = new HttpHeaders();
        const data = new FormData();

        headers.append('Content-Type', 'application/form-data');

        data.append('fullName', request.fullName);
        data.append('email', request.email);
        data.append('phone', request.phone);
        data.append('dOB', request.dOB);
        data.append('addressLine1', request.addressLine1);
        data.append('addressLine2', request.addressLine2);
        data.append('county', request.county);
        data.append('country', request.country);
        data.append('city', request.city);
        data.append('state', request.state);
        data.append('zipCode', request.zipCode);
        data.append('countryCode', request.countryCode);
        data.append('stateCode', request.stateCode);
        data.append('aptSte', request.aptSte);
        data.append('longitude', request.longitude);
        data.append('latitude', request.latitude);
        data.append('profilePic', request.profilePic);
        data.append('gender', request.gender);
        data.append('password', request.password);
        data.append('confirmPassword', request.confirmPassword);
        data.append('imdb', request.imdb);
        data.append('personalWebSite', request.personalWebSite);
        data.append('reel', request.reel);
        data.append('gear', request.gear);
        data.append('resume', request.resume);


        for (let i = 0; i < constants.roles.maxRoles; i++) {
            if (request.roles[i]) {
                data.append(`roles[${i}]`, request.roles[i]);
            }
        }

        return this.http
            .post(url, data, { headers })
            .map(r => true)
            .catch(r => this.respUtils.onServiceError(r));
    }

    companySignup(request: CompanySignupRequest) {
        const url = environment.endpoints.signup.company;
        const data = new FormData();

        // data.append('betaCode', request.betaCode);
        data.append('companyName', request.companyName);
        data.append('phone', request.companyPhone);
        data.append('companyEmail', request.companyEmail);
        data.append('reel', request.companyReel);
        data.append('companyWebSite', request.companyWebSite);
        data.append('companyPic', request.companyPic);
        data.append('imdb', request.imdb);
        data.append('password', request.password);
        data.append('confirmPassword', request.confirmPassword);
        data.append('addressLine1', request.addressLine1);
        data.append('addressLine2', request.addressLine2);
        data.append('county', request.county);
        data.append('country', request.country);
        data.append('city', request.city);
        data.append('state', request.state);
        data.append('zipCode', request.zipCode);
        data.append('countryCode', request.countryCode);
        data.append('stateCode', request.stateCode);
        data.append('aptSte', request.aptSte);
        data.append('longitude', request.longitude);
        data.append('latitude', request.latitude);

        return this.http
            .post(url, data)
            .map(r => true)
            .catch(r => this.respUtils.onServiceError(r));
    }

    saveAbortUser(request: SignupRequest) {
        const url = environment.endpoints.signup.abortUser;
        const headers = new HttpHeaders();
        const data = new FormData();

        headers.append('Content-Type', 'application/form-data');
        data.append('firstName', request.firstName);
        data.append('lastName', request.lastName);
        data.append('email', request.email);
        data.append('city', request.city);
        data.append('state', request.state);
        data.append('zipCode', request.zipCode);
        data.append('personalWebSite', request.personalWebSite);

        return this.http
            .post(url, data, { headers })
            .map(r => true)
            .catch(r => this.respUtils.onServiceError(r));
    }

    checkEmailExists(email: string) {
        return this.http
            .get(environment.endpoints.signup.checkEmailExists(email))
            .map(r => true);
    }


    public keyHeaders;
    private firstPromoterKey = "c0f17460b17dc7f67b44eaa44ba9ba4c";
    signUpLeadUrl = "https://firstpromoter.com/api/v1/track/signup";
    
    createSignUpLead(data: any) {
        let headers = new HttpHeaders({ 'x-api-key': this.firstPromoterKey });
        return this.http.post(this.signUpLeadUrl, data, { headers: headers })
            .map(res => res)

    }


}