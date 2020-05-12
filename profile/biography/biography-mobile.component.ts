import { Component, OnInit } from '@angular/core';
import { ProfilePage } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'ij-biography-mobile',
  templateUrl: './biography-mobile.component.html',
  styleUrls: ['./biography-mobile.component.less']
})
export class BiographyMobileComponent extends BaseProfileComponent  {

  constructor(  route: ActivatedRoute,
    router: Router,) {  super(route, router); }


    onProfileChanged() {
       super.onProfileChanged();
    }
}
