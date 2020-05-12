import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'ij-offer-jobs',
    templateUrl: './offers.component.html',
    styleUrls: ['./styles.less']
})
export class OffersComponent {
    constructor (
        route: ActivatedRoute,
        router: Router,
    ) {       
        console.log('constructor');
    }

    ngOnInit() {
        console.log('init');
    }

    ngOnDestroy() {
    
    }
}