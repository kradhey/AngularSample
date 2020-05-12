import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { ProfilePage, DefaultPageSize, ReviewsOnOverview, ProjectCard, Reviewer } from './models';
import { ProfileService } from './profile.service';
import { ProfileReviewsComponent } from 'profile/reviews/profile-reviews.component';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class ProfileResolverService implements Resolve<ProfilePage> {
    constructor(
        private profileSvc: ProfileService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProfilePage> {
        //commented following code because profilesysid may or may not be present in paramMap after change
        let viewingProfileSysId = route.paramMap.get('fullname');
        if (viewingProfileSysId == null) {
            viewingProfileSysId = route.paramMap.get('profileSysId');
        }

        //getting the profileSysId from localStorage as profileSysId is not always be in paramMap starts
        //const viewingProfileSysId = localStorage.getItem('profileSysId');
        ////getting the profileSysId from localStorage as profileSysId is not always be in paramMap ends

        let reviewCount = ReviewsOnOverview;

        if (route.component == ProfileReviewsComponent) {
            reviewCount = DefaultPageSize;
        }

        return this.profileSvc.getProfile(viewingProfileSysId, reviewCount)
            .first()
            .map(profile => {
                if (profile) {
                    return this.build(profile, viewingProfileSysId);
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

    private build(page: ProfilePage, viewingProfileSysId?: string) {
        if (page.reviews && page.reviews.cards && page.reviews.cards.length > 0) {
            for (const card of page.reviews.cards) {
                Reviewer.Initialize(card.reviewer, viewingProfileSysId);
            }
        }

        if (page.projects && page.projects.cards && page.projects.cards.length > 0) {
            for (const card of page.projects.cards) {
                ProjectCard.Initialize(card);
            }
        }

        ProfilePage.Initialize(page);

        return page;
    }
}