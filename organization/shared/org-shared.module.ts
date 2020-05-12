import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OrgHeaderComponent } from './components/org-header/org-header.component';
import { OrgFooterComponent } from './components/org-footer/org-footer.component';

@NgModule({
  
   imports: [
    CommonModule,
    FormsModule,
    RouterModule,
   ],
   declarations: [
    OrgHeaderComponent,
    OrgFooterComponent
   ],
   exports: [
    OrgHeaderComponent,
    OrgFooterComponent
   ],
   providers:[]

})
export class OrgSharedModule
{

}