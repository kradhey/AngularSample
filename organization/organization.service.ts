import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials, LoginModel } from './credentials';
import { SearchCardsResponse } from '../search/models';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { OrganizationList, AllowBadge, ChangePasswordRequest } from './models';
import {
  ProfileSettingsPage,
  PdfUploadResponse
} from '../profile/settings/models';

interface ILoginResponse {
  username: string,
  password: string
}


@Injectable()
export class OrganizationService {
  public type = "student"
  username: string;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }



  getFeaturedMembers(crewRole: string): Observable<SearchCardsResponse> {
    const url = environment.endpoints.search.featured(crewRole);

    return this.http
      .get<ISiteApiResponse>(url)
      .map(r => this.onGetCards(r));
  }

  getProfileDetail(username: string) {
    const url = environment.endpoints.organization.profileDetail(username)
    return this.http
      .get(url)
      .map(r => r)
      .catch(e => this.onError(e));
  }


  // getCsv(type:string,username:string)
  // {
  //   const url = environment.endpoints.organization.getCsv(type,username);
  //   return this.http
  //   .post(url, {})
  //   .map(r=>r)
  //   .catch(e => this.onError(e));
  // }

  getMember(Type, userName: string) {
    const url = environment.endpoints.organization.organizationDetail(Type, userName);

    return this.http
      .get(url)
      .map(r => r as ProfileSettingsPage[])
      .catch(e => this.onError(e));
  }
  allowBadge(model: AllowBadge) {
    const url = environment.endpoints.organization.allowBadge;
    return this.http
      .post(url, model)
      .map(r => r)
      .catch(e => this.onError(e));
  }
  getOrganization(model: LoginModel) {
    const url = environment.endpoints.organization.organizationLogin;
    return this.http
      .post(url, model)
      .map(r => this.onLogin(r))
      .catch(e => this.onError(e));
  }

  private onLogin(data: any) {
    if (!data) {
      return "invalid";
    }
    else {
      localStorage.setItem("userOrganisation", data.userName)
      localStorage.setItem("userOrganisationId", data.id)
      localStorage.setItem("userOrgLogIn", "true")
      this.router.navigate(['/organization/home']);
    }
  }

  changePassword(request: ChangePasswordRequest) {
    const url = environment.endpoints.profile.freelancer.changePasswordOrganization;

    return this.http
      .post(url, request)
      .map(r => r);
  }
  private onError(e): Observable<any> {

    return e;
  }

  private onGetCards(response: ISiteApiResponse) {

    return response.data || {};
  }

  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "S NO, ";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      if (index == 'profileId' || index == 'badgeId') {
        continue;
      }
      else {

        if (index == 'crewRoles') {
          row += 'Listed Roles, ';
        }
        else if (index == 'creationDate') {
          row += 'Joining Date, ';
        }
        else {
          row += index.split(/(?=[A-Z])/).join(" ").toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ') + ',';
        }
      }

    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = (i + 1).toString() + ',';
      for (var index in array[i]) {

        if (line != '') line += ' '
        if (index == 'profileId' || index == 'badgeId') {
          continue;
        }
        else {
          if (index == 'fullName') {
            line += ((array[i][index])) + ','

          }
          else if (index == 'crewRoles') {
            line += ((array[i][index]).toString().replace(/,/g, ";")) + ','
            console.log(line);
          }
          else {
            line += ((array[i][index])) + ',';
          }
        }

      }
      str += line + '\r\n';
    }
    return str;
  }
}
