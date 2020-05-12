import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
// routing
import { ResetPasswordRoutingModule } from './reset.password-routing.module';

// modules
import { SharedModule } from '../shared/shared.module';

// components
import { ResetPasswordComponent } from './reset.password.component';

@NgModule({
    imports: [ 
        CommonModule,
        FormsModule,
        CustomFormsModule,
        SharedModule,
        ResetPasswordRoutingModule
    ],
    declarations: [
        ResetPasswordComponent
    ],
    exports: [ 
        ResetPasswordComponent 
    ],
    providers: [ 

    ]
})
export class ResetPasswordModule {}