import { Component, OnInit, ElementRef } from '@angular/core';
import { ProfilePage } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import * as organizationslider from 'shared/view/organizationslider';
@Component({
  selector: 'ij-general-mobile',
  templateUrl: './general-mobile.component.html',
  styleUrls: ['./general-mobile.component.less']
})
export class GeneralMobileComponent extends BaseProfileComponent  {
   public loginCompany: boolean = false;
    public loginFreelancer: boolean = false;
    public el: ElementRef;
   public hide=false;
  public imgpath = '../../assets/images/male-university-graduate-silhouette-with-the-cap.png';
  public imgpath2 = '../../assets/images/Organization.png';

  constructor(route: ActivatedRoute, router: Router, ) {
    super(route, router);
    setTimeout(() => {
      organizationslider.slide(this.el);
    }, 200);
  }


    onProfileChanged() {
        super.onProfileChanged();

        this.setProfileType(); 
    }

    private setProfileType() {
      if (this.model.profileSysId.startsWith("company")) {
          this.loginCompany = true;
          this.loginFreelancer = false;
      } else {
          this.loginCompany = false;
          this.loginFreelancer = true;
      }
  }
}
