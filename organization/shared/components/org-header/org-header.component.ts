import { Component, EventEmitter, Output } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { OrganizationService } from './../../../organization.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'org-header',
  templateUrl: './org-header.component.html',
  styleUrls: ['./org-header.less']
})

export class OrgHeaderComponent {
  public alumni: string;
  public model: any;
  public student: string;
  constructor(private router: Router, private organizationService: OrganizationService) {
    var user = localStorage.getItem("userOrganisation");
    this.organizationService.getProfileDetail(user).subscribe(r => {

      this.model = r[0];
      console.log(this.model);
    })
  }
  @Output() navigationEvent = new EventEmitter();

  onClick(event, button) {
    event.target.classList.add('active');
    if (button == 'student') {
      var element = document.getElementById('alumni');
      element.classList.remove('active');
    } else {
      var element = document.getElementById('student');
      element.classList.remove('active');
    }

    this.navigationEvent.emit(button);
  }

  logOut() {
    localStorage.setItem("userOrganisation", null)
    localStorage.setItem("userOrganisationId", null)
    localStorage.setItem("userOrgLogIn", null)
    this.router.navigate(['/organization/login']);
  }

  public getThumbnailImageUrl() {
    if (this.model.organisationprofilePic) {
      return environment.site.imageUrl(this.model.organisationprofilePic);
    }
    return "/assets/images/avatars/avatar-sm.png";
  }

  Redirect() {
    this.router.navigate(['/organization/profile']);
  }

}
