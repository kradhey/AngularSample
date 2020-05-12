import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { AllJobsComponent } from  './all-jobs/all-jobs.component'
import { ProjectComponent } from './project.component';
import { OffersComponent } from './offers/offers.component';

const routes: Routes = [
//   {
//     path: '',
//     component: ProjectComponent
//   },
  {
    path: '',
    component: ProjectComponent,
    children: [{
      path: '',
      children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: AllJobsComponent },
        { path: 'offers', component: OffersComponent },
      ]  
    }]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class ProjectRoutingModule {}