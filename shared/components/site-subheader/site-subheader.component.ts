import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'auth/auth.service';

@Component({
  selector: 'ij-site-subheader',
  templateUrl: 'site-subheader.component.html',
  styleUrls: ['./site-subheader.less']
})
export class SiteSubHeaderComponent {
  showQuickSearch: boolean = false;

  @ViewChild("quicksearch") quicksearch;

  get isLoggedIn() {
    return this.authSvc.isLoggedIn;
  }

  constructor (
    private authSvc: AuthService
  ) { }

  onToggleQuickSearch() {
    this.showQuickSearch = !this.showQuickSearch;

    setTimeout(() => {
      if (this.showQuickSearch) {
        this.quicksearch.show();
      }
    }, 0)
  }
  
  onSelected() {
    this.showQuickSearch = false;
  }
}