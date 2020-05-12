import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HireProfileRequest } from './models';

import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from "shared/components/project-search/ProjectSearchItem";

@Injectable()
export class HireProfileService {
  constructor(
    private http: HttpClient
  ) { }

  hireProfile(profileSysId: string, req: HireProfileRequest): Observable<boolean> {
    const url = environment.endpoints.profile.freelancer.hire(profileSysId);

    return this.http
      .post<ISiteApiResponse>(url, req)
      .map(r => this.onGet(r));
  }

  songTitles(title: string, type: string): Observable<ProjectSearchItem[]> {
    const url = environment.endpoints.profile.freelancer.projectBySongTitles(title, type);
    return this.http
      .post<ISiteApiResponse>(url, {})
      .map(r => this.onGet(r));
  }

  episodeTitles(title: string, type: string): Observable<ProjectSearchItem[]> {
    const url = environment.endpoints.profile.freelancer.projectByEpisodeTitles(title, type);

    return this.http
      .post<ISiteApiResponse>(url, {})
      .map(r => this.onGet(r));
  }

  byProjectTitles(title: string, type: string): Observable<ProjectSearchItem[]> {
    const url = environment.endpoints.profile.freelancer.projectByTitles(title, type);
    return this.http
      .post<ISiteApiResponse>(url, {})
      .map(r => this.onGet(r));
  }

  private onGet(response: ISiteApiResponse) {
    return response.data || {};
  }
}
