import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganizationService } from '../organization.service';
import { ProfileSettingsPage, PdfUploadResponse } from '../../profile/settings/models';
import { OrganizationList, AllowBadge } from '../models';
import { Routes, RouterModule,Router } from '@angular/router';
import { LocalStorage } from '../../../node_modules/@ng-idle/core';
import { orgProfilePicDialogService, ProfilePicDialogMode } from 'shared/dialogs/org-profile-pic/dialog.service';
import { debug } from 'util';
@Component({
  selector: 'org-profile',
  templateUrl: './profile.component..html',
  styleUrls: ['./profile.less']

})
export class OrgProfileComponent {

  public model:any;
  public activeTab="personal";
  constructor(private organizationService: OrganizationService,
     private router: Router,
     private proPicSvc: orgProfilePicDialogService,) {
    var login = localStorage.getItem('userOrgLogIn');
    if (login != 'true') {
      this.router.navigate(['organization/login']);
    }
  var user=localStorage.getItem("userOrganisation");
    this.organizationService.getProfileDetail(user).subscribe(r => {
     
      this.model = r[0];
   
    })
  

  }

  onTab(tab: string) {
    this.activeTab = tab;
}

onProfilePicClicked(event) {
  this.proPicSvc.showDialog(ProfilePicDialogMode.ExistingProfile);
}

personalSave()
{

}
passwordSave()
{

}
  
}
