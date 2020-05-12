import { Component, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService, AuthResult } from 'auth/auth.service';
import { Credentials,LoginModel } from './credentials';
import { environment } from 'environments/environment';
import { SocialUser, ConfirmAccount } from './models';
import { ProgressColorService } from 'shared/services/progress-color.service';
import { IntercomProxyService } from 'shared/services/intercom-proxy.service';
import { OrganizationService } from './organization.service';

import 'rxjs/add/operator/first';
import { invalid } from 'moment';

@Component({
  selector: 'ij-organization',
  templateUrl: './organization.component.html'

})
export class OrganizationComponent {
  credentials: Credentials = new Credentials();
  error: string;
  success: string;
  submitted: boolean;
  hideSocialLogin: boolean;
  accountVerifiedMsg: string;
  isEmailNotConfirmed: boolean = false;
  LoginModel:LoginModel

  constructor(private organizationService: OrganizationService) {

  }

  login(valid: boolean) {
    
    if (!valid) return;

    this.error = "";
    this.success = "";
    this.submitted = true;
    this.LoginModel = new LoginModel();
    this.LoginModel.username = this.credentials.email;
    this.LoginModel.password = this.credentials.password;
    this.organizationService.getOrganization(this.LoginModel).subscribe(r => {
   
    })
   
   
  }


}
