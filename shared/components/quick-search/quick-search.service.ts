import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { QuickSearchItem } from './QuickSearchItem';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { ProjectSearchItem } from '../project-search/ProjectSearchItem';

@Injectable()
export class QuickSearchService {
  constructor(
    private http: HttpClient
  ) { }

  getQuickSearch(name: string): Observable<QuickSearchItem[]> {
    const url = environment.endpoints.search.quick(name);

    return this.http
      .get<ISiteApiResponse>(url)
      .map(r => this.onGet(r));
  }
 
    getQuickProjectSearch(name: string): Observable<ProjectSearchItem[]> {
      return this.http
        .get<ISiteApiResponse>("")
        .map(r => this.onGet(r));
    }
    
    private onGet(response: ISiteApiResponse) {
        return response.data || {};
    }
}
