import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/subscription';
import { ConfirmationService } from 'primeng/primeng';
import { ISiteApiResponse, SiteApiResponseUtilities,SiteApiResponseUtilitiesOrganization } from 'shared/services/SiteApiResponse';
import { LookupService } from 'shared/services/lookup.service';
import { ProfilePicDialogService, ProfilePicDialogMode } from 'shared/dialogs/profile-pic/dialog.service';
import { AuthService } from 'auth/auth.service';
import { State } from 'shared/services/usa-states';
import { environment } from 'environments/environment';
import { constants } from 'environments/constants';
import { ProfileService } from '../profile.service';
import { masks } from 'shared/view/masks';
import { patterns } from 'shared/view/regex-patterns';
import { CrewRole } from 'shared/services/CrewRole';
import { UnionType } from 'shared/services/UnionType';
import { Cities } from 'shared/services/Cities'
import * as utils from 'shared/lang/object';
import { Budget, Budgets } from 'shared/services/Budget';
import { BudgetProfile } from 'shared/services/BudgetProfile'
import { ProfileStatusTypes } from 'shared/services/ProfileStatusTypes';
import { NotificationsService } from 'angular2-notifications';
import { BudgetList, Organizations, WorkingCity,OrganizationsEnum } from './models';
import { CoverPicDialogService,CoverPicDialogMode} from 'shared/dialogs/cover-photo/dialog.service'
import { BehindScenePicDialogService,BehindScenePicDialogMode} from 'shared/dialogs/behind-the-scene/dialog.service'

import {
    ProfileSettingsPage,
    PdfUploadResponse
} from './models';

import { BudgetLevels } from 'shared/services/BudgetLevels';
import createAutoCorrectedDatePipe from '../../../node_modules/text-mask-addons/dist/createAutoCorrectedDatePipe';
import { Address } from '../../../node_modules/ngx-google-places-autocomplete/objects/address';

@Component({
    selector: 'ij-profile-settings',
    templateUrl: 'profile-settings.component.html',
    styleUrls: ['settings.less'],
    providers: [ConfirmationService]
})
export class ProfileSettingsComponent implements OnInit {
    confirmAcceptLabel = "Yes";
    enableDelete: boolean = true;
    public orgPassCode: string;
    public orgmodel: Organizations;
    private organizations: Organizations[];
    private oragnisationValidation: string;
    public submitted: boolean;
    public states: State[];
    public budgets = Budgets;
    public AllBudgets: BudgetProfile[] = [];
    public crewRoleSuggestions: string[];
    public allCitiesSuggestions: string[];
    public allUnionTypeSuggestions: string[];
    public allGenderTypeSuggestions: string[];
    public allCrewRoles: CrewRole[] = [];
    public unionTypes: UnionType[] = [];
    public AllCities: Cities[] = [];
    public allStateTypeSuggestions: string[];
    public model: ProfileSettingsPage;
    public allBudgetSuggestions: string[];
    public nameRegex = patterns.fullName;
    public imdbIdRegex = patterns.imdbId;
    public zipCodeMask = masks.zipCode;
    public phoneMask = masks.phone;
    public dateMask = masks.date;
    public yearMask = masks.year;
    public dayMonthMask = masks.dayMonth;
    public phoneRegex = patterns.phone;
    public urlRegex = patterns.url;
    public zipCodeRegex = patterns.zipCode;

    public maxGearFileSize = constants.gear.maxSize;
    public maxResumeFileSize = constants.resume.maxSize;

    public showSaveErrored: boolean;

    public genders = [];
    public profileUrl: string = null;
    public errors: string[] = [];
    public orgErrors:string[]=[];
    public activeTab: string = 'portfolio';
    public budgetLevelList: BudgetList[] = [];
    BudgetList: BudgetList[] = [];
    budgetLevel: BudgetLevels;
    minBirthDate = new Date();
    autoCorrectedDayPipe = createAutoCorrectedDatePipe('dd');
    autoCorrectedMonthPipe = createAutoCorrectedDatePipe('mm');
    isValidPhoneNumber: boolean = true;

    set isProfileActive(v: boolean) {
        this.model.profileStatus = v ? ProfileStatusTypes.Active : ProfileStatusTypes.Inactive;
        this.onStatusChanged();
    }

    get isProfileActive() {
        return this.model.profileStatus == ProfileStatusTypes.Active ? true : false;
    }

    @ViewChild('fuGear') fuGear;
    public gearUrl = environment.endpoints.upload.gear;

    @ViewChild('fuResume') fuResume;
    public resumeUrl = environment.endpoints.upload.resume;

    private crewSub: ISubscription;
    private saveSub: ISubscription;
    private getSub: ISubscription;
    private respUtils = new SiteApiResponseUtilities();
    private respUtilsOrganization=new SiteApiResponseUtilitiesOrganization();
    private googleComponentForm: any;

    constructor(
        private route: ActivatedRoute,
        private lookupSvc: LookupService,
        private profileSvc: ProfileService,
        private authSvc: AuthService,
        private proPicSvc: ProfilePicDialogService,
        private coverPicSvc:CoverPicDialogService,
        private behindScenePicSvc:BehindScenePicDialogService,
        private notificationSvc: NotificationsService,
        private router: Router,
        private confirmSvc: ConfirmationService
    ) {
        this.states = this.lookupSvc.getStates().slice(1);
        this.googleComponentForm = this.lookupSvc.googleAutoCompleteForm;
    }

    onTab(tab: string) {
        this.activeTab = tab;
        this.showSaveErrored = false;
        // if (tab == 'personal') {
        //     setTimeout(() => {
        //         this.placesAutocomplete = places({
        //             container: document.querySelector('#street-address-input'),
        //             type: 'address',
        //             templates: {
        //                 value: function (suggestion) {
        //                     return suggestion.name;
        //                 }
        //             }
        //         });
        //         this.placesAutocomplete.on('change', this.placeAutoCompleteChangeEvt);
        //     });
        // }
    }



    onCoverPicClicked(event)
    {
        this.coverPicSvc.showDialog(CoverPicDialogMode.ExistingProfile)
    }
    onBehindTheSceneClicked(event)
    {
        this.behindScenePicSvc.showDialog(BehindScenePicDialogMode.ExistingProfile)
    }


    ngOnInit() {
        this.getAllOrganizations();
        this.showSaveErrored = false;
        this.lookupSvc.getUnionTypes().subscribe(unionTypeList => {
            this.unionTypes = unionTypeList;
        });

        this.getSub = this.route.data.subscribe((data: { settings: ProfileSettingsPage }) => {
            this.onBuildModel(data.settings);
            if (this.model.workingCities.length == 0) {
                this.addWorkingCity();
            }
            this.model.previousAddressLine1 = this.model.formattedAddress;
        });
        this.crewSub = this.lookupSvc.getCrewRoles().subscribe(crewRoles => {
            this.allCrewRoles = crewRoles;
        });

        this.setGenders();
        // this.setState();
        this.setBudgetList();
        this.AllBudgets = this.BudgetList;
        this.minBirthDate.setFullYear(this.minBirthDate.getFullYear() - 18);
    }



    getOrganization() {
        
           this.profileSvc.getOrganizationDetail(this.model.passCode,OrganizationsEnum.passcode).subscribe(detail => {
               // this.getAllOrganizations();
               if (typeof (detail) == 'string') {
                   this.oragnisationValidation = detail;
               }
               if (typeof (detail) == 'object') {
                   this.organizations = detail;
                   this.oragnisationValidation = null;
               }
           },
   
           detail=> this.onOrgSaveError(detail) )
           
   
   
       }
   
       getAllOrganizations() {
           
           this.profileSvc.getOrganizationDetail("initiall",OrganizationsEnum.initialRecord).subscribe(detail => {
   
               if (typeof (detail) == 'string') {
   
               }
               if (typeof (detail) == 'object') {
                   this.organizations = detail
               }
           },
             detail=> this.onOrgSaveError(detail) )
       }

    telInputObject(obj) {
        if (this.model && this.model.phoneNumber)
            obj.intlTelInput('setNumber', this.model.phoneNumber);
    }

    phoneErrorEvt(obj) {
        this.isValidPhoneNumber = obj;
    }


    getNumber(obj) {
        this.model.phoneNumber = obj;
        console.log(obj);
    }


    onCountryChange(obj) {
        console.log(obj);
    }

    ngOnDestroy() {
        if (this.crewSub) {
            this.crewSub.unsubscribe();
        }

        if (this.saveSub) {
            this.saveSub.unsubscribe();
        }

        if (this.getSub) {
            this.getSub.unsubscribe();
        }
    }

    personalSave(form) {
        if (this.model.phoneNumber == '') {
            this.isValidPhoneNumber = true;
        }
        this.submitted = true;
        this.showSaveErrored = false;

        if (!form.valid || !this.isValidPhoneNumber) return;

        if (this.model.previousAddressLine1 != this.model.formattedAddress) {
            this.model.addressLine1 = this.model.formattedAddress;
        }

        this.saveSub = this.profileSvc
            .savePersonalSettings(this.model)
            .first()
            .subscribe(r => {
                this.onSaveSuccess();
            },
                e => this.onSaveError(e));
    }
    private onOrgSaveError(error = null) {
        if (typeof (error) === "string") {
            this.errors.push(error);
        } else {
            if (error) {
                this.orgErrors = this.respUtilsOrganization.getErrors(error);
            }
        }
        this.oragnisationValidation="Error";
  }

    portfolioSave(form) {
        this.submitted = true;
        this.showSaveErrored = false;

        if (!form.valid) {
            return;
        }

        if (this.fuGear.files.length > 0) {
            this.fuGear.upload();
        }

        if (this.fuResume.files.length > 0) {
            this.fuResume.upload();
        }

        if (this.model.workingCities.some((x) => !x.city)) {
            return;
        }

        this.saveSub = this.profileSvc
            .savePortfolioSettings(this.model)
            .first()
            .subscribe(r => {
                this.onSaveSuccess();
            },
                e => this.onSaveError(e));
    }

    setState() {
        const abbv = this.model.state;
        const selectedState = this.states.filter(f => f.abbreviation == abbv).map(r => r.name + ` (${r.abbreviation})`);
        this.model.state = selectedState[0];
    }

    onProfilePicClicked(event) {
        this.proPicSvc.showDialog(ProfilePicDialogMode.ExistingProfile);
    }

    onBeforeSend(event) {
        if (event.xhr) {
            event.xhr.setRequestHeader('Authorization', this.authSvc.bearer);
        }
    }

    onPdfUploaded(event) {
        const xhr = event.xhr as XMLHttpRequest;

        if (xhr != null && xhr.status == 200) {
            const resp = JSON.parse(xhr.response) as ISiteApiResponse;
            const data = resp.data as PdfUploadResponse;
            this.model.resume = data.fileName;

            if (!resp.error && !data.error) {
                this.onSaveSuccess();
            }
            else {
                this.onSaveError();
            }
        }
        else {
            this.onSaveError();
        }
    }

    showFormInvalid(form) {
        return this.submitted && form.invalid && !this.showSaveErrored;
    }

    onCrewRolesKeyDown(event) {
        if (this.model.crewRoles && this.model.crewRoles.length >= constants.roles.maxRoles) return [];

        const query = (event.query || "").toLocaleLowerCase();

        this.crewRoleSuggestions = this.allCrewRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    onStateTypeKeyDown(event) {
        const query = (event.query || "").toLocaleLowerCase();

        this.allStateTypeSuggestions = this.states
            .filter(f => f.name.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.name + ' (' + r.abbreviation + ')');
    }

    onGenderTypeKeyDown(event) {
        const query = (event.query || "").toLocaleLowerCase();

        this.allGenderTypeSuggestions = this.genders
            .filter(f => f.name.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.name);
    }

    onStatusChanged() {
        this.profileSvc.updateStatus(this.model.profileStatus).subscribe(r => { }, e => this.onSaveError(e));
    }

    onBudgetsKeyDown(event) {
        const query = (event.query || "").toLocaleLowerCase();
        this.allBudgetSuggestions = this.AllBudgets
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    onUnionTypeKeyDown(event) {
        const query = (event.query || "").toLocaleLowerCase();

        this.allUnionTypeSuggestions = this.unionTypes
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label);
    }

    private setGenders() {
        for (let g of this.lookupSvc.getGenders()) {
            this.genders.push({ name: g, value: g });
        }
    }


    private setBudgetList() {
        let matchingIndex: number;
        this.budgetLevel = new BudgetLevels(this.model.reviewsCount, this.model.projectsCount, this.model.biography);
        this.lookupSvc.getBudgetKeys().forEach((item, index) => {
            let requirements;
            switch (Budgets[item]) {
                case Budgets.StudentBudget:
                    requirements = this.budgetLevel.studentBudgettext;
                    break;
                case Budgets.UltraLowBudget:
                    requirements = this.budgetLevel.ultraLowBudgetText;
                    break;
                case Budgets.LowBudget:
                    requirements = this.budgetLevel.lowBudgetText;
                    break;
                case Budgets.IndustryScale:
                    requirements = this.budgetLevel.industryScaleBudgetText;
                    break;
                case Budgets.UnionRates:
                    requirements = this.budgetLevel.unionRateBudgetText;
                    break;
            }
            if (Budgets[item] == this.model.defaultBudget) {
                matchingIndex = index;
            }
            if ((index > matchingIndex || this.model.defaultBudget == Budgets.InvisibleToPublic) && requirements != '') {
                this.budgetLevelList.push({ label: Budgets[item] + ` (${requirements})`, value: item, name: Budgets[item], disabled: true });
            }

            else {
                this.budgetLevelList.push({ label: Budgets[item], value: item, name: Budgets[item] });
            }
        });
    }

    private onBuildModel(page: ProfileSettingsPage) {
        ProfileSettingsPage.SetReelUrl(page);

        this.model = null;
        this.model = page;
        this.profileUrl = environment.site.profile(this.model.profileSysId);

        if (!this.model.unionTypeId) {
            this.model.unionTypeId = 1;
        }
        if (this.model.personalWebSite)
            this.model.personalWebSite = this.model.personalWebSite.replace(/(^\w+:|^)\/\//, '');
    }

    private onSaveSuccess() {
        this.showSaveErrored = false;
        this.errors = [];

        if (this.notificationSvc) {
            this.notificationSvc.success("Success", "Your settings have been updated.");
        }
        const profileUrl = environment.site.profileUrl(this.authSvc.fullName, this.authSvc.userPositionInList);
        this.router.navigateByUrl(profileUrl);
    }

    private onSaveError(error = null) {
        if (typeof (error) === "string") {
            this.errors.push(error);
        } else {
            if (error) {
                this.errors = this.respUtils.getErrors(error);
            }
        }

        this.showSaveErrored = true;
    }


    delete(orgPassCode: string) {

        let message = "Are you sure you want to delete this organization?";
        this.confirmAcceptLabel = "Yes";
        let rejectVisible = true;

        this.confirmSvc.confirm({
            message,
            header: "Delete Organization",
            rejectVisible,
            accept: () => {
                this.orgErrors=null;
                this.profileSvc.deleteOrganization(orgPassCode).subscribe(detail => {
                    this.organizations = detail;
                })

            }
        });

    }
    enbTn() {
        this.enableDelete = false;
    }
    desbTn() {
        this.enableDelete = true;
    }

    addWorkingCity() {
        this.model.workingCities.push(new WorkingCity());
    }

    removeWorkingCity(deletedIndex) {
        this.model.workingCities.splice(deletedIndex, 1);
    }


    public handleAddressChange(place: Address, workingCity: WorkingCity) {
        this.clearWorkingCity(workingCity);
        for (let i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0];
            if (this.googleComponentForm[addressType]) {
                let val = place.address_components[i][this.googleComponentForm[addressType]];

                if (addressType == 'locality') {
                    workingCity.city = val;
                }
                else if (addressType == 'administrative_area_level_1') {
                    workingCity.state = val;
                    workingCity.stateCode = place.address_components[i]['short_name'];
                }
                else if (addressType == 'country') {
                    workingCity.country = val;
                    workingCity.countryCode = place.address_components[i]['short_name'];
                }
            }
        }
        workingCity.latitude = place.geometry.location.lat();
        workingCity.longitude = place.geometry.location.lng();
        workingCity.isSelected = true;

        workingCity.formattedAddress = workingCity.city;
        if(workingCity.stateCode){
            workingCity.formattedAddress = `${workingCity.formattedAddress}, ${workingCity.stateCode}`;
        }
    }

    handleAddressBlur(workingCity: WorkingCity) {
        if (!workingCity.isSelected) {
            workingCity.city = '';
        }
    }

    public handlePersonalAddressChange(place: Address) {
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
                    this.model.state = place.address_components[i]['long_name'];;
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

    private clearWorkingCity(workingCity: WorkingCity) {
        workingCity.city = '';
        workingCity.state = '';
        workingCity.country = '';
        workingCity.stateCode = '';
        workingCity.countryCode = '';
        workingCity.formattedAddress = '';
        workingCity.latitude = null;
        workingCity.longitude = null;
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
