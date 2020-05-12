import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'ij-all-jobs',
    templateUrl: './all-jobs.component.html',
    styleUrls: ['./styles.less']
})
export class AllJobsComponent {
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