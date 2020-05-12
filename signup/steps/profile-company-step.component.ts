import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseStepComponent, ProfileCompanyStep } from './models';
import { ProfilePicDialogService, ProfilePicDialogMode } from 'shared/dialogs/profile-pic/dialog.service';
import { masks } from '../../shared/view/masks';
import { patterns } from '../../shared/view/regex-patterns';
import { LookupService } from 'shared/services/lookup.service';
import { Address } from '../../../node_modules/ngx-google-places-autocomplete/objects/address';
import { SignupService } from '../signup.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';

@Component({
    selector: "ij-su-profile-company-step",
    templateUrl: "profile-company-step.component.html",
    styleUrls: [
        "../../shared/styles/account/common.less",
        "../../shared/styles/account/forms.less",
    ]
})
export class ProfileCompanyStepComponent extends BaseStepComponent {
    passwordRegex = patterns.password;
    phoneMask = masks.phone;
    phoneRegex = patterns.phone;
    urlRegex = patterns.url;
    nameRegex = patterns.name;
    zipcodeMask = masks.zipCode;
    zipcodeRegex = patterns.zipCode;
    states = [];
    isValidPhoneNumber: boolean;
    emailExists: boolean;
    private googleComponentForm: any;
    @Input() model: ProfileCompanyStep;

    constructor(
        router: Router,
        private lookup: LookupService,
        private picDlg: ProfilePicDialogService,
        private signupSvc: SignupService
    ) {
        super(router);
        this.states = this.lookup.getStates();
        this.googleComponentForm = this.lookup.googleAutoCompleteForm;
    }

    onProfilePicClicked(event) {
        event.preventDefault();
        this.picDlg.showDialog(ProfilePicDialogMode.Signup);
    }

    onProfilePicSaved(event) {
        this.model.companyPic = event;
    }

    onNextStep(form: any) {
        this.model.errors = [];
        this.emailExists = false;
        if (!this.validate(form) || !this.model.companyPic || !this.isValidPhoneNumber) {
            return;
        }

        if(this.model.previousAddressLine1 != this.model.formattedAddress){
            this.clearAddressFields();
        }

        if (!this.model.addressLine1) {
            this.model.addressLine1 = this.model.formattedAddress;
        }
        this.nextStep();
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


    onCountryChange(obj) {
        console.log(obj);
    }


    checkEmailExists() {
        this.model.errors = [];
        this.emailExists = false;
        if (!this.model.companyEmail) return;
        this.signupSvc.checkEmailExists(this.model.companyEmail).first().subscribe(
            r => r,
            e => this.onEmailExistsError(e)
        )
    }

    onEmailExistsError(error: HttpErrorResponse) {
        this.model.errors = error.error.data;
        this.emailExists = true;
    }

    public handleAddressChange(place: Address) {
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
        if(this.model.stateCode){
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