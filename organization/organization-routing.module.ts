import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrgLoginComponent } from './login/login.component';
import { OrgHomeComponent } from './home/home.component';
import { OrganizationComponent } from './organization.component';
import {OrgProfileComponent} from './Profile/profile.component'
const routes: Routes = [
    {
      path: '',
      component: OrganizationComponent,
      children: [{
        path: '',
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: OrgLoginComponent },
          { path: 'home', component: OrgHomeComponent},
          { path:'profile',component:OrgProfileComponent}
        ]  
      }]
    }
  ];
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class OrganizationRoutingModule {}
