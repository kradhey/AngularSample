import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyProfileSettingsComponent } from './company-profile-settings.component';
import { CompanyProfileSettingsResolverService } from 'profile/settings-company/company-profile-settings-resolver.service';
import { AuthGuard } from 'auth/auth.guard';

const routes: Routes = [{ 
  path: '', 
  component:CompanyProfileSettingsComponent,
  resolve: {settings: CompanyProfileSettingsResolverService},
  canLoad: [AuthGuard],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [ CompanyProfileSettingsResolverService ]
})
export class CompanyProfileSettingsRoutingModule {}