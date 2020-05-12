import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { SearchCardsRequest, SearchCardsResponse, SearchPage } from './models';
import { SearchService } from './search.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class SearchResolverService implements Resolve<SearchPage> {
    constructor (
        private searchSvc: SearchService,
        private router: Router 
    ) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SearchPage> {
        let req = SearchCardsRequest.FromRoute(route);
        let cards: Observable<SearchCardsResponse> = null;
        let page = new SearchPage();
        
        if (req.isComplete) {
            cards = this.searchSvc.getCards(req);
        }
        else {
            cards = this.searchSvc.getFeaturedMembers("Director");
            page.showFeaturedMembers = true;
        }

        return cards.map(data => {
            if (data) {
                Object.assign(page, data);
                return page;
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