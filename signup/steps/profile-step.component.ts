import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

import { BaseStepComponent, ProfileStep } from './models';
import { IValidCityRequest } from 'shared/services/address.service';
import { LookupService } from 'shared/services/lookup.service';
import { ProfilePicDialogService, ProfilePicDialogMode } from 'shared/dialogs/profile-pic/dialog.service';
import { masks } from 'shared/view/masks';
import { patterns } from 'shared/view/regex-patterns';
import { constants } from 'environments/constants';
import { CrewRole } from 'shared/services/CrewRole';
import { AddressService } from 'shared/services/address.service';
import { Genders } from 'shared/services/Genders';
import * as places from 'places.js';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import { Address } from '../../../node_modules/ngx-google-places-autocomplete/objects/address';
import { SignupService } from '../signup.service';
import { SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';

@Component({
    selector: 'ij-profile-step',
    templateUrl: 'profile-step.component.html',
    styleUrls: [
        '../../shared/styles/account/common.less',
        '../../shared/styles/account/forms.less'
    ],
    providers: [ProfilePicDialogService, AddressService]
})
export class ProfileStepComponent extends BaseStepComponent implements OnInit, OnDestroy {
    public nameRegex = patterns.fullName;
    public zipcodeMask = masks.zipCode;
    public zipcodeRegex = patterns.zipCode;
    public dateMask = masks.date;
    public passwordRegex = patterns.password;
    public roleSuggestions: string[];
    public allRoles: CrewRole[] = [];
    public states = [];
    public genders = [];
    isValidPhoneNumber: boolean;
    autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy');
    minBirthDate = new Date();
    emailExists: boolean;
    @Input() model: ProfileStep;

    private roleSub: ISubscription;
    private placesAutocomplete: any;
    private googleComponentForm: any;
    constructor
        (
        router: Router,
        private lookup: LookupService,
        private picDlg: ProfilePicDialogService,
        private addressSvc: AddressService,
        private signupSvc: SignupService
        ) {
        super(router);
        this.states = lookup.getStates();
        this.googleComponentForm = this.lookup.googleAutoCompleteForm;
    }

    ngOnInit() {
        this.setGenders();
        this.roleSub = this.lookup.getCrewRoles().subscribe(roles => {
            this.allRoles = roles;
        });
        this.minBirthDate.setFullYear(this.minBirthDate.getFullYear() - 18);
    }

    ngOnDestroy() {
        if (this.roleSub) {
            this.roleSub.unsubscribe();
        }
    }

    onNext(form: any) {
        debugger
        this.model.errors = [];
        this.emailExists = false;
        if (!this.validate(form) || !this.model.profilePic || !this.isValidPhoneNumber) {
            return;
        }
        if(this.model.previousAddressLine1 != this.model.formattedAddress){
            this.clearAddressFields();
        }

        if (!this.model.addressLine1) {
            this.model.addressLine1 = this.model.formattedAddress;
        }
        this.next();
    }

    onProfilePicClicked(event) {
        event.preventDefault();
        this.picDlg.showDialog(ProfilePicDialogMode.Signup);
    }

    onProfilePicSaved(event) {
        this.model.profilePic = event;
    }

    onRolesKeyDown(event) {
        if (this.model.roles && this.model.roles.length >= constants.roles.maxRoles) return [];

        var query = (event.query || "").toLocaleLowerCase();

        this.roleSuggestions = this.allRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    trimFullName(name: string) {
        this.model.fullName = name.replace(/(^\s+|\s+$)/g, "")
    }

    private setGenders() {
        this.genders.push({ name: 'Gender *', value: '' });

        for (let g of this.lookup.getGenderKeys()) {
            this.genders.push({ name: Genders[g], value: g });
        }
    }

    telInputObject(obj) {
        console.log(obj);
        // obj.intlTelInput('setCountry', 'in');
        if (this.model && this.model.phone)
            obj.intlTelInput('setNumber', this.model.phone);
    }

    phoneErrorEvt(obj) {
        this.isValidPhoneNumber = obj;
    }


    getNumber(obj) {
        this.model.phone = obj; 
        console.log(obj);
    }

    checkEmailExists() {
        this.model.errors = [];
        this.emailExists = false;
        if (!this.model.email) return;
        this.signupSvc.checkEmailExists(this.model.email).first().subscribe(
            r => r,
            e => this.onEmailExistsError(e)
        )
    }

    onEmailExistsError(error: HttpErrorResponse) {
        this.model.errors = error.error.data;
        this.emailExists = true;
    }

    public handleAddressChange(place: Address) {
        debugger
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        this.clearAddressFields();
        this.model.addressLine1 = place.name;
        this.model.latitude = place.geometry.location.lat();
        this.model.longitude = place.geometry.location.lng();

        for (let i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0];
            if (this.googleComponentForm[addressType]) {
                let val = place.address_components[i][this.googleComponentForm[addressType]];
                if (addressType == 'street_number') {
                    this.model.aptSte = val;
                }
                else if (addressType == 'route') {
                    this.model.addressLine2 = val;
                }
                else if (addressType == 'sublocality_level_1') {
                    if (this.model.addressLine2)
                        this.model.addressLine2 = `${this.model.addressLine2} ${val}`;
                    else
                        this.model.addressLine2 = val;
                }
                else if (addressType == 'locality') {
                    this.model.city = val;
                }
                else if (addressType == 'postal_town' && !this.model.city) {
                    this.model.city = val;
                }
                else if (addressType == 'administrative_area_level_1') {
                    this.model.state = val;
                    this.model.stateCode = place.address_components[i]['short_name'];
                }
                else if (addressType == 'administrative_area_level_2') {
                    this.model.county = val;
                }
                else if (addressType == 'country') {
                    this.model.country = val;
                    this.model.countryCode = place.address_components[i]['short_name'];
                }
                else if (addressType == 'postal_code') {
                    this.model.zipCode = val;
                }
            }
        }

        this.model.formattedAddress = this.model.addressLine1;
        if (this.model.stateCode) {
            this.model.formattedAddress = `${this.model.formattedAddress}, ${this.model.stateCode}`;
        }
        this.model.previousAddressLine1 = this.model.formattedAddress;
    }

    private clearAddressFields() {
        this.model.addressLine1 = '';
        this.model.latitude = null;
        this.model.longitude = null;
        this.model.aptSte = '';
        this.model.addressLine2 = '';
        this.model.city = '';
        this.model.state = '';
        this.model.county = '';
        this.model.country = '';
        this.model.zipCode = '';
        this.model.stateCode = '';
        this.model.countryCode = '';
    }

}