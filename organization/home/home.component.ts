import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganizationService } from '../organization.service';
import { ProfileSettingsPage, PdfUploadResponse } from '../../profile/settings/models';
import { OrganizationList, AllowBadge } from '../models';
import { Routes, RouterModule, Router } from '@angular/router';

import { LocalStorage } from '../../../node_modules/@ng-idle/core';
import { debug } from 'util';
import { MyFilterPipe } from './../../shared/pipes/myfilter.pipe'
import { environment } from 'environments/environment';
import { AuthService } from 'auth/auth.service';
import { forEach } from '../../../node_modules/@angular/router/src/utils/collection';
@Component({
  selector: 'org-home',
  templateUrl: './home.component..html',
  styleUrls: ['./home.less']

})
export class OrgHomeComponent {

  public model: OrganizationList[];
  public countModel: number;
  public filter: MyFilterPipe;
  public Type: string;
  public searchText: string;
  public username: string;
  public allowBadgeModel: AllowBadge;
  public FullName: string;
  public typeStudent: string = "student";

  constructor(private organizationService: OrganizationService, private router: Router, private authSvc: AuthService) {
    var login = localStorage.getItem('userOrgLogIn');
    if (login != 'true') {
      this.router.navigate(['organization/login']);

    }
    this.username = localStorage.getItem('userOrganisation')
    this.organizationService.getMember('student', this.username).subscribe(r => {
      this.model = r;
      this.countModel = this.model.length;
      this.Type = 'STUDENTS';
    })


  }
  handleNavigation($event) {
    this.organizationService.getMember($event, this.username).subscribe(r => {

      this.model = r;
      this.countModel = this.model.length;
      if ($event == 'student') {
        this.Type = 'STUDENTS';
        this.typeStudent = 'student'
      }
      else {
        this.Type = 'ALUMNI';
        this.typeStudent = 'alumni'
      }

    })
  }

  exportCsv() {
    this.organizationService.getMember(this.typeStudent, this.username).subscribe(r => {


      var csvData = this.organizationService.ConvertToCSV(r);
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'Report.csv';
      a.click();
    });
  }



  allowBadge($event, id) {
    console.log($event);
    this.allowBadgeModel = { id: id, allow: $event };
    this.organizationService.allowBadge(this.allowBadgeModel).subscribe(r => {

    })
  }

  get profileUrl() {
    return '/profile/' + this.FullName;
  }
}
