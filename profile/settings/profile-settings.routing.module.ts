import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSettingsComponent } from './profile-settings.component';
import { ProfileSettingsResolverService } from 'profile/settings/profile-settings-resolver.service';
import { AuthGuard } from 'auth/auth.guard';

const routes: Routes = [{ 
  path: '', 
  component: ProfileSettingsComponent,
  resolve: {settings: ProfileSettingsResolverService},
  canLoad: [AuthGuard],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [ ProfileSettingsResolverService ]
})
export class ProfileSettingsRoutingModule {}