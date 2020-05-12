import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

export enum ProfileType {
    Freelancer,
    ProductionCompany
}

export class BetaCodeStep {
    constructor(public betaCode?: string) { }
}

export class ProfileChoiceStep {
    constructor(public type?: ProfileType) { }
}

export class ProfileCompanyStep {
    companyName: string;
    companyEmail: string;
    phone: string;
    companyRole: string;
    password: string
    confirmPassword: string;
    city: string;
    state: string;
    companyPic: string;
    public addressLine1: string;
    public addressLine2: string;
    public aptSte: string;
    public county: string;
    public province: string;
    public country: string;
    public zipCode: string;
    public latitude: any;
    public longitude: any;
    public countryCode: string;
    public stateCode: string;
    public formattedAddress: string;
    public previousAddressLine1: string;
    public errors: string[];
    constructor() {
        this.state = "";
        this.companyPic = "";
    }
}

export class ProfileStep {
    public firstName: string;
    public lastName: string;
    public fullName: string;
    public phone: string;
    public dOB: string;
    public email: string;
    public addressLine1: string;
    public addressLine2: string;
    public aptSte: string;
    public city: string;
    public state: string;
    public county: string;
    public province: string;
    public country: string;
    public zipCode: string;
    public gender: string;
    public password: string;
    public confirmPassword: string;
    public roles: string[];
    public profilePic: string;
    public profileIncomplete: boolean;
    public latitude: any;
    public longitude: any;
    public countryCode: string;
    public stateCode: string;
    public formattedAddress: string;
    public previousAddressLine1: string;
    public errors: string[];
    constructor() {
        this.profilePic = "";
        this.state = "";
        this.gender = "";
        this.profileIncomplete = true;
    }
}

export class PortfolioStep {
    public imdb: string;
    public personalWebSite: string;
    public reel: string;

    // file
    public resume: any;
    public gear: any;

    public errors: string[];
}


export class PortfolioCompanyStep {
    public imdb: string;
    public companyWebSite: string;
    public reel: string;
    public acceptTerms: boolean;
    public errors: string[];
}
export class BaseStepComponent {
    public submitted: boolean = false;
    public acceptTerms: boolean = false;
    public isValidated: boolean = false;
    @Output() onStepChanged = new EventEmitter<number>();
    @Output() onSignupClicked = new EventEmitter<boolean>();
    @Output() onCompanySignupClicked = new EventEmitter<boolean>();

    constructor(
        private router: Router
    ) { }

    onNext(form: any) {
        if (!this.validate(form)) {
            return;
        }

        this.next();
    }

    onNextStep(form: any) {
        if (!this.validate(form)) {
            return;
        }

        this.nextStep();
    }

    onBackStep() {
        this.backStep();
    }

    onBack() {
        this.back();
    }

    onSignup(form: any) {
        if (!this.validate(form) || !this.acceptTerms) {
            return;
        }
        this.isValidated = true;
        this.onSignupClicked.emit(true);
    }
    onCompanySignup(form: any) {
        if (!this.validate(form)) {
            return;
        }
        this.isValidated = true;
        this.onCompanySignupClicked.emit(true);
    }

    onCancel() {
        this.router.navigate(['/login']);
    }

    trackByIndex(index: number, value: number) {
        return index;
    }


    protected nextStep() {
        this.onStepChanged.emit(5);
    }

    protected backStep() {
        this.onStepChanged.emit(-5);

    }
    protected next() {
        this.onStepChanged.emit(1);
    }

    protected back() {
        this.onStepChanged.emit(-1);
    }

    protected validate(form: any) {
        this.submitted = true;
        if (!form)
            return false;
        if (form && !form.valid) return false;

        return true;
    }
}