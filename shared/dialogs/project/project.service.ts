import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NewProjectRequest } from './models';
import { EditProjectRequest } from './models';
import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from "shared/components/project-search/ProjectSearchItem";

@Injectable()
export class ProjectService {
  constructor(
    private http: HttpClient
  ) { }

  newProject(req: NewProjectRequest): Observable<boolean> {
    const utils = new SiteApiResponseUtilities();
    const url = environment.endpoints.profile.freelancer.project();

    return this.http
      .post(url, req)
      .map(r => true)
      .catch(r => utils.onServiceError(r));
  }

  updateProject(req: NewProjectRequest, id: number): Observable<any> {
    const utils = new SiteApiResponseUtilities();
    const url = environment.endpoints.profile.freelancer.updateProject(id);

    return this.http
      .post(url, req)
      .map(r => true)
      .catch(r => utils.onServiceError(r));
  }

  editProject(id: number): Observable<any> {
    const url = environment.endpoints.profile.freelancer.editProject(id);

    return this.http
      .post<ISiteApiResponse>(url, {})
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
