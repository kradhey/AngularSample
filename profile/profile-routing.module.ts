import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ProfileResolverService } from './profile-resolver.service';
import { ProfileComponent } from './profile.component';
import { ProfileOverviewComponent } from './overview/profile-overview.component';
import { ProfileReviewsComponent } from './reviews/profile-reviews.component';
import { ProfileResumeComponent } from './resume/profile-resume.component';
import { ProfileGearComponent } from './gear/profile-gear.component';
import { ProfileHistoryReviewsComponent } from './history/profile-history.component'
import { BiographyMobileComponent } from './biography/biography-mobile.component';
import { GeneralMobileComponent } from './general/general-mobile.component';
import { ProfileSettingsResolverService } from './settings/profile-settings-resolver.service';
import { ProfileSettingsComponent } from './settings/profile-settings.component';
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'settings',
    loadChildren: './settings/profile-settings.module#ProfileSettingsModule',
  },
  {
    path: 'company-settings',
    loadChildren: './settings-company/company-profile-settings.module#CompanyProfileSettingsModule'
  },
  //new start --Working
  {
    path: ':fullname',
    component: ProfileComponent,
    children: [{
      path: '',
      children: [
        { resolve: { profile: ProfileResolverService }, path: '', component: ProfileOverviewComponent },
      ]
    }]
  },
  //end
  {
    path: ':profileSysId',
    component: ProfileComponent,
    children: [{
      path: '',
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },

        { resolve: { profile: ProfileResolverService }, path: 'overview', component: ProfileOverviewComponent },
        { resolve: { profile: ProfileResolverService }, path: 'reviews', component: ProfileReviewsComponent },
        { resolve: { profile: ProfileResolverService }, path: 'biography', component: BiographyMobileComponent },
        { resolve: { profile: ProfileResolverService }, path: 'general', component: GeneralMobileComponent },
        { resolve: { profile: ProfileResolverService }, path: 'resume', component: ProfileResumeComponent },
        { resolve: { profile: ProfileResolverService }, path: 'gear', component: ProfileGearComponent },
        { resolve: { profile: ProfileResolverService }, path: 'history', component: ProfileHistoryReviewsComponent }
      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProfileResolverService]
})
export class ProfileRoutingModule { }