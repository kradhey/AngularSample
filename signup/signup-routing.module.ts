import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';
import { BetaRequestComponent } from './beta-request/beta-request.component';

const routes: Routes = [
    { path: '', component: SignupComponent },
    { path: 'request', component: BetaRequestComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
}) 
export class SignupRoutingModule {}
