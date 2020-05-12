import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import {CompanyProfileSettingsPage }  from './models';
import { ProfileService } from '../profile.service';

import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';

@Injectable()
export class CompanyProfileSettingsResolverService implements Resolve<CompanyProfileSettingsPage> {
    constructor (
        private profileSvc: ProfileService,
        private router: Router 
    ) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CompanyProfileSettingsPage> {
        return this.profileSvc.getCompanySettings()
            .first()
            .map(settings => {
                if (settings) {
                    return settings;
                } else {
                    this.router.navigate(['/']);
                    return null;
                }
            })
            .catch(error => {
                this.router.navigate(['/']);
                return Observable.of(null);
            });
    }
}