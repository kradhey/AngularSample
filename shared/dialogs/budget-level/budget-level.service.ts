import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SiteApiResponseUtilities, ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';
import { BudgetLevelDialog, BudgetDetails, ReviewDetails } from './models';

@Injectable()
export class BudgetLevelService {
  constructor(
    private http: HttpClient
  ) { }

  updateBudgetNotification(){
    const url = environment.endpoints.profile.freelancer.updateBugetNotification;
    return this.http.post(url, []).map(r => true)
  }
}
