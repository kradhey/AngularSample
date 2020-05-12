import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { HireRequestProfileDialogService } from './dialog.service';
import { DialogHeaderService } from '../header/dialog-header.service';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { HireProfileDialog, HireProfileRequest,HireProfileRequestDisplay } from './models';
import { HireRequestProfileService } from './hire-profile.service';
import { LookupService } from 'shared/services/lookup.service';
import { CrewRole } from 'shared/services/CrewRole';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'auth/auth.service';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operator/first';

@Component({
    selector: 'ij-reqhire-profile-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['styles.less'],
    providers: [HireRequestProfileService]
})
export class HireRequestProfileDialogComponent extends BaseDialogComponent<HireProfileDialog> implements OnDestroy {
    rateMask = createNumberMask({prefix: '' });
    allCrewRoles: CrewRole[] = [];
    crewRoleSuggestions: string[] = [];
    allProjectTypes: string[] = [];
    projectTypeSuggestions: string[];
    IsRemoveButton: boolean = false;
    modeldata : HireProfileRequestDisplay;
    
    states = [];

    private dialogSub: ISubscription;
    private headerSub: ISubscription;
    private crewSub: ISubscription;
     
    @ViewChild("autocomplete") autocomplete;

    protected get SaveMessage() {
        return "Your response has been sent.";
    }

    constructor (
        el: ElementRef,
        private dialogSvc: HireRequestProfileDialogService,
        private hireSvc: HireRequestProfileService,
        private lookupSvc: LookupService,
        private authSvc: AuthService,
        private headerSvc: DialogHeaderService,
        notificationSvc: NotificationsService,
    ) {
        super(HireProfileDialog, el, notificationSvc);
        this.states = lookupSvc.getStates();

        this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
           this.resetForm(profileSysId);
           this.getCrewRoles();
           this.buildModel();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }

        if (this.headerSub) {
            this.headerSub.unsubscribe();
        }

        if (this.crewSub) {
            this.crewSub.unsubscribe();
        }
    }
    
    onShow() {
        setTimeout(() => {
            this.autocomplete.domHandler.findSingle(this.autocomplete.el.nativeElement, 'input').focus();
        }, 0);
    }

    onAcceptRequest(hireId, model: HireProfileRequestDisplay) {
        this.hireSvc
            .hireRequestResponse(hireId, "Accepted", model)
            .first()
            .subscribe
            (
                r => this.onSaveSuccess(),
                e => this.onSaveError(e),
            );
    }
    
    onDeniedRequest(hireId, model:HireProfileRequestDisplay) {
        this.hireSvc
            .hireRequestResponse(hireId, "Denied", model)
            .first()
            .subscribe
            (
                r => this.onSaveSuccess(),
                e => this.onSaveError(e),
            );
    }

    onAcceptContactCard(accept) {
        this.modeldata.contactcard = accept;
    }

    private buildModel() {
        this.lookupSvc.getProjectDetails(this.profileSysId).first().subscribe(responsedata=>
        {
           this.modeldata=responsedata[0];
           this.modeldata.dates = new Date(this.modeldata.dates.substring(0,10)).toString();
           this.modeldata.crewRoles = this.allCrewRoles.filter(p=>p.value==this.modeldata.crewRoles).map(p=>p.label).toString();
           if(this.modeldata.profileHireSysID==this.authSvc.profileSysId)
           {
             this.headerSub = this.headerSvc.getData(this.modeldata.profileToHireSysID).subscribe(header => {
             this.model = this.newModel();
             DialogHeader.SetProfileImageUrl(header);
             this.model.header = header;
           
             this.IsRemoveButton=true;
             },e => this.onLoadError());
             this.showDialog();
          }
          else
          {
            this.headerSub = this.headerSvc.getData(this.modeldata.profileHireSysID).subscribe(header => {
                this.model = this.newModel();
                DialogHeader.SetProfileImageUrl(header);
                this.model.header = header;
                this.IsRemoveButton=false;
             
              },e => this.onLoadError());
              this.showDialog();
           }
        });
      
    }

    private getCrewRoles() {
        this.crewSub = this.lookupSvc
            .getCrewRoles()
            .subscribe(crewRoles => {
                this.allCrewRoles = crewRoles;
            }, 
            e => this.onLoadError());
    }
}