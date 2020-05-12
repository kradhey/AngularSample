import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from './organization.service';
import { SharedModule } from 'shared/shared.module';
import { DialogModule } from 'primeng/primeng';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';
import { OrgLoginComponent } from './login/login.component';
import { OrgHomeComponent } from './home/home.component';
import { OrgProfileComponent } from './Profile/profile.component'
import { OrgSharedModule } from './shared/org-shared.module';  
import { ChangePasswordComponent } from './Profile/change-password.component';
import { CustomFormsModule } from 'ng2-validation';


import { 
    CheckboxModule, 
    FileUploadModule, 
    RadioButtonModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    TooltipModule
} from 'primeng/primeng';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    OrganizationRoutingModule,
    OrgSharedModule,
    CheckboxModule, 
    FileUploadModule, 
    RadioButtonModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    TooltipModule,
    CustomFormsModule
  ],
  declarations: [ 
    OrganizationComponent,
    OrgLoginComponent,
    OrgHomeComponent,
    OrgProfileComponent,
    ChangePasswordComponent

  ],
  exports: [ 
    OrganizationComponent,
    OrgLoginComponent,
    OrgHomeComponent,
    OrgProfileComponent,
    ChangePasswordComponent
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationModule { }
