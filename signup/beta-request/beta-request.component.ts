import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

import { IValidCityRequest, AddressService } from 'shared/services/address.service';
import { LookupService } from 'shared/services/lookup.service';
import { masks } from 'shared/view/masks';
import { patterns } from 'shared/view/regex-patterns';
import { constants } from 'environments/constants';
import { CrewRole } from 'shared/services/CrewRole';
import { BetaRequest, SignupService } from 'signup/signup.service';
import { SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';

@Component({
    selector: 'ij-beta-request',
    templateUrl: 'beta-request.component.html',
    styleUrls: ['styles.less'],
    providers: [AddressService]
})
export class BetaRequestComponent implements OnInit, OnDestroy {
    private respUtils = new SiteApiResponseUtilities();
    
    public nameRegex = patterns.name;
    public zipcodeMask = masks.zipCode;
    public zipcodeRegex = patterns.zipCode;

    public submitted: boolean;
    public roleSuggestions: string[];
    public allRoles: CrewRole[] = [];
    public states = [];
    public genders = [];
    public errors = [];
    public model: BetaRequest;
    public saveCompleted: boolean;

    private roleSub: ISubscription;
    private requestSub: ISubscription;

    constructor
    (
        private router: Router,
        private lookup: LookupService,
        private addressSvc: AddressService,
        private signupSvc: SignupService
    ) {
        this.states = lookup.getStates();
        this.buildModel();
    }

    ngOnInit() {
        this.saveCompleted = false;
        
        this.roleSub = this.lookup.getCrewRoles().subscribe(roles => {
            this.allRoles = roles;
        });
    }

    ngOnDestroy() {
        if (this.roleSub) {
            this.roleSub.unsubscribe();
        }

        if (this.requestSub) {
            this.requestSub.unsubscribe();
        }
    }

    onRolesKeyDown(event) {
        if (this.model.roles && this.model.roles.length >= constants.roles.maxRoles) return [];
        
        var query = (event.query || "").toLocaleLowerCase();

        this.roleSuggestions = this.allRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    onSubmit(form) {
        if (!this.validate(form)) {
            return;
        }

        this.requestSub = this.signupSvc
            .betaRequest(this.model)
            .subscribe
            (
                r => this.onSuccess(r),
                e => this.onError(e)
            );
    }

    onCancel() {
        this.router.navigate(['/login']);
    }

    private validate(form: any) {
        this.submitted = true;

        if (!form) return false;
        if (form && !form.valid) return false;

        return true;
    }

    private onSuccess(response) {
        this.saveCompleted = true;

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2500);
    }
 
    private onError(error) {
        const errors = this.respUtils.getErrors(error);
        
        if (errors.length === 0) {
            errors.push("An unknown error occurred. Please try again.");
        }

        this.errors = errors;
     }

    private buildModel() {
        this.model = new BetaRequest();
        this.model.state = "";
    }
}