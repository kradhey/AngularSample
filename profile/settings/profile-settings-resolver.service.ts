import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { ProfileSettingsPage }  from './models';
import { ProfileService } from '../profile.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';

@Injectable()
export class ProfileSettingsResolverService implements Resolve<ProfileSettingsPage> {
    constructor (
        private profileSvc: ProfileService,
        private router: Router 
    ) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProfileSettingsPage> {
        return this.profileSvc.getSettings()
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