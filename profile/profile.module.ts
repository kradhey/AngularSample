import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
    CheckboxModule, 
    FileUploadModule, 
    RadioButtonModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ConfirmationService,
    DialogModule,
    TooltipModule
} from 'primeng/primeng';

import { CustomFormsModule } from 'ng2-validation'
import { TextMaskModule } from 'angular2-text-mask';

// entry point
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from 'shared/shared.module';

// profile headers
import { ProfileHeaderDesktopComponent } from './profile-header-desktop.component';
import { ProfileHeaderMobileComponent } from './profile-header-mobile.component';

// overview section
import { ProfileOverviewComponent } from './overview/profile-overview.component';
import { ProfileOverviewAboutComponent } from './overview/overview-about.component';
import { ProfileOverviewProjectsComponent } from './overview/overview-projects.component';
import { ProfileOverviewReviewsComponent } from './overview/overview-reviews.component';

import { ProfileReviewsComponent } from './reviews/profile-reviews.component';
import { ProfileResumeComponent } from './resume/profile-resume.component';
import { ProfileGearComponent } from './gear/profile-gear.component';
import { ProfileHistoryReviewsComponent } from './history/profile-history.component'
import { GeneralMobileComponent } from './general/general-mobile.component';
import { ProfileService } from './profile.service';
import { BiographyMobileComponent } from './biography/biography-mobile.component';
// Pipes
import {  TruncatePipe }   from '../shared/pipes/truncate.pipe';
import {  SplitPipe    }   from '../shared/pipes/split.pipe';
import { SignalRConnectionService } from 'chat/services/signalR.connection.service';
import { ChatModule } from 'chat/chat.module';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        SharedModule,
        CheckboxModule,
        TextMaskModule,
        CustomFormsModule,
        FileUploadModule,
        AutoCompleteModule,
        DialogModule,
        RadioButtonModule,
        ProfileRoutingModule,
        ConfirmDialogModule,
        TooltipModule,
        // ChatModule
    ],
    declarations: [
        ProfileComponent,
        ProfileHeaderDesktopComponent,
        ProfileHeaderMobileComponent,
        GeneralMobileComponent,
        ProfileOverviewComponent,
        ProfileOverviewAboutComponent,
        ProfileOverviewProjectsComponent,
        ProfileOverviewReviewsComponent,
        BiographyMobileComponent,
        ProfileReviewsComponent,
        ProfileResumeComponent,
        ProfileGearComponent,
        ProfileHistoryReviewsComponent,
        TruncatePipe,
        SplitPipe
    ],
    exports: [ 
        ProfileComponent
    ],
    providers: [
        ProfileService,
        SignalRConnectionService
    ]
})
export class ProfileModule {}