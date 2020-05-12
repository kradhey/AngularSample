import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { SiteApiResponseUtilities } from 'shared/services/SiteApiResponse';
import { AuthService, AuthResult } from 'auth/auth.service';

import {
    BetaCodeStep,
    ProfileStep,
    PortfolioStep,
    ProfileChoiceStep,
    ProfileCompanyStep,
    PortfolioCompanyStep
} from './steps/models';

import { SignupRequest, SignupService, CompanySignupRequest } from './signup.service';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/first';
import { retry } from 'rxjs/operators/retry';
import { ProgressColorService } from 'shared/services/progress-color.service';
import { IntercomProxyService } from 'shared/services/intercom-proxy.service';
import { SignUpLeadModel } from './signup-lead.model';

enum Steps {
    BetaCode = "beta",
    ProfileChoice = "choice",
    Company = "company",
    Freelancer = "freelancer",
    Portfolio = "portfolio",
    AccountConfirm = "confirm",
    CompanyPortfolio = "folio"
}

@Component({
    selector: 'ij-signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.less']
})
export class SignupComponent implements OnDestroy, OnInit {
    private respUtils = new SiteApiResponseUtilities();

    constructor(
        private router: Router,
        private signupSvc: SignupService,
        private authSvc: AuthService,
        private intercomSvc: IntercomProxyService,
        private progressSvc: ProgressColorService,
        private route: ActivatedRoute

    ) {
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                if (this.profileStep.firstName && this.profileStep.lastName
                    && this.profileStep.email && this.profileStep.profileIncomplete) {
                    this.saveAbortUser();
                }
            }
        });

        this.progressSvc.color = '#FFFFFF';
    }

    public betaCodeStep: BetaCodeStep = new BetaCodeStep();
    public profileStep: ProfileStep = new ProfileStep();
    public portfolioStep: PortfolioStep = new PortfolioStep();
    public porfileChoice: ProfileChoiceStep = new ProfileChoiceStep();
    public profileCompanyStep: ProfileCompanyStep = new ProfileCompanyStep();
    public companyPortfolioStep: PortfolioCompanyStep = new PortfolioCompanyStep();
    public currentStepNumber: number = 1;
    public stepType = Steps;
    public freelancer: boolean;
    public company: boolean = false;

    get showTimeline() {
        return this.currentStep != Steps.BetaCode && this.currentStep != Steps.ProfileChoice
    }

    get currentStep() {
        switch (this.currentStepNumber) {
            case 0:
                return Steps.BetaCode;
            case 1:
                return Steps.ProfileChoice;
            case 2:
                this.freelancer = true;
                this.company = false;
                return Steps.Freelancer;
            case 3:
                return Steps.Portfolio;
            case 4:
                return Steps.AccountConfirm;
            case 6:
                this.freelancer = false;
                this.company = true;
                return Steps.Company;
            case 11:
                return Steps.CompanyPortfolio;
            case 16:
                return Steps.AccountConfirm;
        }
    }

    ngOnInit() {

        window.addEventListener('unload', this.onUnloadCallBack);

        if (this.authSvc.socialUser) {
            this.currentStepNumber = 0;
            this.profileStep.firstName = this.authSvc.socialUser.firstName;
            this.profileStep.lastName = this.authSvc.socialUser.lastName;
            this.profileStep.email = this.authSvc.socialUser.email;
            this.profileStep.city = this.authSvc.socialUser.city;
            this.profileStep.state = this.authSvc.socialUser.state;
            this.profileStep.gender = this.authSvc.socialUser.gender;

            if (this.authSvc.socialUser.imageUrl) {
                var convertFunc = this.convertFileToDataURLviaFileReader(this.authSvc.socialUser.imageUrl, this.imageConverterCallBack)
            }
        }
    }

    ngOnDestroy() {
        this.betaCodeStep = new BetaCodeStep();
        this.profileStep = new ProfileStep();
        this.portfolioStep = new PortfolioStep();
        this.profileCompanyStep = new ProfileCompanyStep();
        this.companyPortfolioStep = new PortfolioCompanyStep();
        this.progressSvc.reset();
    }

    onUnloadCallBack = (event) => {
        if (this.profileStep.firstName && this.profileStep.lastName
            && this.profileStep.email && this.profileStep.profileIncomplete) {
            this.saveAbortUser();
        }
    }

    saveAbortUser() {
        const request = new SignupRequest();
        request.firstName = this.profileStep.firstName;
        request.lastName = this.profileStep.lastName;
        request.email = this.profileStep.email;
        request.city = this.profileStep.city;
        request.state = this.profileStep.state;
        request.zipCode = this.profileStep.zipCode;
        request.personalWebSite = this.portfolioStep.personalWebSite;

        this.signupSvc
            .saveAbortUser(request)
            .first()
            .subscribe
            (
            r => r,
            e => e
            );
    }

    onStepChanged(difference: number) {
        this.currentStepNumber += difference;
        window.scrollTo(0, 0);
    }

    onSignup() {
        const request = new SignupRequest();

        // request.betaCode = this.betaCodeStep.betaCode;
        // request.firstName = this.profileStep.firstName;
        // request.lastName = this.profileStep.lastName;
        request.email = this.profileStep.email;
        request.roles = this.profileStep.roles;
        request.phone = this.profileStep.phone;
        request.dOB = this.profileStep.dOB;
        request.addressLine1 = this.profileStep.addressLine1;
        request.addressLine2 = this.profileStep.addressLine2;
        request.county = this.profileStep.county;
        request.country = this.profileStep.country;
        request.countryCode = this.profileStep.countryCode;
        request.stateCode = this.profileStep.stateCode;
        request.aptSte = this.profileStep.aptSte;
        request.fullName = this.profileStep.fullName;
        request.city = this.profileStep.city;
        request.state = this.profileStep.state;
        request.zipCode = this.profileStep.zipCode;
        request.latitude = this.profileStep.latitude;
        request.longitude = this.profileStep.longitude;
        request.profilePic = this.profileStep.profilePic;
        request.gender = this.profileStep.gender;
        request.password = this.profileStep.password;
        request.confirmPassword = this.profileStep.confirmPassword;

        request.imdb = this.portfolioStep.imdb;
        request.personalWebSite = this.portfolioStep.personalWebSite;
        request.reel = this.portfolioStep.reel;
        request.gear = this.portfolioStep.gear;
        request.resume = this.portfolioStep.resume;

        this.signupSvc
            .signup(request)
            .first()
            .subscribe
            (
            r => this.onSignupSuccess(r),
            e => this.onSignupError(e)
            );
    }

    onCompanySignup() {
        const request = new CompanySignupRequest();

        // request.betaCode = this.betaCodeStep.betaCode;
        request.companyName = this.profileCompanyStep.companyName;
        request.companyEmail = this.profileCompanyStep.companyEmail;
        request.companyPhone = this.profileCompanyStep.phone;
        request.companyRole = this.profileCompanyStep.companyRole;
        request.password = this.profileCompanyStep.password;
        request.confirmPassword = this.profileCompanyStep.confirmPassword;
        request.imdb = this.companyPortfolioStep.imdb;
        request.city = this.profileCompanyStep.city;
        request.state = this.profileCompanyStep.state;
        request.zipCode = this.profileCompanyStep.zipCode
        request.addressLine1 = this.profileCompanyStep.addressLine1;
        request.addressLine2 = this.profileCompanyStep.addressLine2;
        request.county = this.profileCompanyStep.county;
        request.country = this.profileCompanyStep.country;
        request.countryCode = this.profileCompanyStep.countryCode;
        request.stateCode = this.profileCompanyStep.stateCode;
        request.aptSte = this.profileCompanyStep.aptSte;
        request.latitude = this.profileCompanyStep.latitude;
        request.longitude = this.profileCompanyStep.longitude;
        request.companyPic = this.profileCompanyStep.companyPic;
        request.companyWebSite = this.companyPortfolioStep.companyWebSite;
        request.companyReel = this.companyPortfolioStep.reel;

        if (this.companyPortfolioStep.acceptTerms) {
            this.signupSvc.companySignup(request).first().subscribe(
                r => this.onCompanySignupSuccess(r),
                e => this.onCompanySignupError(e)
            )
        }
    }

    signUpLeadObj: SignUpLeadModel = new SignUpLeadModel();
    signUpLeadResponse: any = [];
    onSignupSuccess(response) {
        this.profileStep.profileIncomplete = false;
        this.currentStepNumber = 4;
        this.intercomSvc.boot(this.profileStep.fullName, this.profileStep.email);

        let param1 = this.route.snapshot.queryParams["fp_ref"];
        this.signUpLeadObj.email = this.profileStep.email;
        this.signUpLeadObj.ref_id = param1;

        if (response == true) {
            var data = this.signupSvc.createSignUpLead(this.signUpLeadObj).subscribe(res => {
                this.signUpLeadResponse = res;
                console.log(this.signUpLeadResponse)
                if (this.signUpLeadResponse != undefined) {
                    console.log("Lead generated succesfuly !")
                }
            })
        }


        (<any>window).fbq('track', 'CompleteRegistration');
    }

    onSignupError(error) {
        const errors = this.respUtils.getErrors(error);

        if (errors.length === 0) {
            errors.push("An unknown error occurred. Please try again.");
        }

        this.portfolioStep.errors = errors;
    }

    onCompanySignupSuccess(response) {
        this.profileStep.profileIncomplete = false;
        this.currentStepNumber = 16;
        this.intercomSvc.boot(this.profileCompanyStep.companyName, this.profileCompanyStep.companyEmail);
    }

    onCompanySignupError(error) {
        const errors = this.respUtils.getErrors(error);

        if (errors.length === 0) {
            errors.push("An unknown error occurred. Please try again.");
        }

        this.companyPortfolioStep.errors = errors;
    }

    imageConverterCallBack = (base64Img) => {
        if (base64Img) {
            this.profileStep.profilePic = base64Img.toString();
        }
    }

    convertFileToDataURLviaFileReader(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
}