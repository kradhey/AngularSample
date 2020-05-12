import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from 'shared/shared.module';

import { DialogModule ,AutoCompleteModule } from 'primeng/primeng';

import { BetaRequestComponent } from './beta-request/beta-request.component';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { SignupTimelineComponent } from './timeline/signup-timeline.component';
import { SignupTimeline2Component } from './timeline-company/signup-timeline-company.component';
import { ProfileStepComponent } from './steps/profile-step.component';
import { PortfolioStepComponent } from './steps/portfolio-step.component';
import { ProfileChoiceStepComponent } from './steps/profile-choice-step.component';
import { BetaCodeStepComponent } from './steps/betacode-step.component';
import { SignupService } from './signup.service';
import { ProfileCompanyStepComponent } from './steps/profile-company-step.component';
import { SignupTermsDialogComponent } from 'signup/terms-dialog/dialog.component';
import { SignupTermsDialogService } from 'signup/terms-dialog/dialog.service';
import { AccountConfirmStepComponent } from 'signup/steps/account-confirm-step.component';
import { PrivatePolicyDialogComponent } from 'signup/private-policy-dialog/dialog.component';
import { PrivatePolicyDialogService } from 'signup/private-policy-dialog/dialog.service';
import { PortfolioCompanyStepComponent } from './steps/portfolio-company-step.component'
import { GooglePlaceModule } from '../../node_modules/ngx-google-places-autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { InternationalPhoneModule } from 'ng4-intl-phone';
@NgModule({
    imports: [ 
        GooglePlaceModule,
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        CustomFormsModule,
        TextMaskModule,
        AutoCompleteModule,
        SignupRoutingModule,
        SharedModule,
        DialogModule,
        Ng2TelInputModule,
        InternationalPhoneModule
    ],
    declarations: [ 
        SignupComponent,
        SignupTimelineComponent,
        SignupTimeline2Component,
        ProfileStepComponent,
        PortfolioStepComponent,
        BetaCodeStepComponent,
        BetaRequestComponent,
        SignupTermsDialogComponent,
        AccountConfirmStepComponent,
        PrivatePolicyDialogComponent,
        ProfileCompanyStepComponent,
        ProfileChoiceStepComponent,
        PortfolioCompanyStepComponent
    ],
    exports: [ 
        SignupComponent 
    ],
    providers: [ 
        SignupService,
        SignupTermsDialogService,
        PrivatePolicyDialogService
    ]
})
export class SignupModule {}