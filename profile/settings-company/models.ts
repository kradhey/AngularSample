import { CompanyProfileSettingsComponent } from './company-profile-settings.component';
import { ProfileStatusTypes } from 'shared/services/ProfileStatusTypes';
import { environment } from 'environments/environment';
import { WorkingCity } from '../settings/models';

function getYouTubeImage(id) {
    return environment.site.video.youTubeThumbnail(id);
}

function getYouTubeVideo(id) {
    return environment.site.video.youTubeVideo(id);
}

function getVimeoVideo(id) {
    return environment.site.video.vimeoVideo(id);
}

export enum OrganizationsEnum
{
    initialRecord=0,
    company=1,
    passcode=2,
}
export class CompanyProfileSettingsPage {
    public acceptsUltraLowBudget: boolean;
    public acceptsIndustryScale: boolean;
    public acceptsLowBudget: boolean;
    public acceptsUnionRates: boolean;
    public defaultBudget: string;

    public profileSysId: string;
    public firstName: string;
    public lastName: string;
    public crewRoles: string[];
    public profileCities: string[];
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipCode: string;
    public formattedAddress: string;
    public previousAddressLine1: string;
    public latitude: any;
    public longitude: any;
    public province: string;
    public county: string;
    public country: string;
    public aptSte: string;
    public stateCode: string;
    public countryCode: string;
    public email: string;
    public phoneNumber: string;
    public dietaryRestrictions: string;
    public allergies: string;
    public gender: string;
    public resume: string;
    public gearList: string;
    public imdbId: string;
    public reelId: string;
    public reelType: string;
    public reel: string;
    public personalWebSite: string;

    public biography: string;
    public enableWeeklyNewsletters: boolean;
    public notifyOnReviews: boolean;
    public notifyOnOldMessages: boolean;

    public showRefer: boolean;
    public showContactMe: boolean;
    public showHireMe: boolean;
    public showResume: boolean;
    public showGear: boolean;
    public showHistory: boolean;
    public unionTypeId: number;
    public unionTypeName: string;
    public profileStatus: ProfileStatusTypes;
    public companyPhone :string;
    public companyRole:string;
    public corporateStructure:string;
    public speciality :string;
    public projectsCount:number;
    public reviewsCount:number;
    public passCode:string;
    public workingCities: WorkingCity[];
    public static SetReelUrl(page: CompanyProfileSettingsPage) {
        if (page && page.reelId) {
            if (page.reelType === 'YouTube') {
                page.reel = getYouTubeVideo(page.reelId);
            }
            else if (page.reelType === 'Vimeo') {
                page.reel = getVimeoVideo(page.reelId);
            }
        }
    }
}

export class Organizations {

    public organizationName: string;
  
    public organizationPassCode: string;
  }
export class CompanyUpdateProfileSettingsRequest {
    public profileSysId: string;
    public firstName: string;
    public lastName: string;
    public crewRoles: string[];
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipCode: string;
    public email: string;
    public phoneNumber: string;
    public dietaryRestrictions: string;
    public allergies: string;
    public acceptsUltraLowBudget: boolean;
    public acceptsIndustryScale: boolean;
    public acceptsLowBudget: boolean;
    public acceptsUnionRates: boolean;
    public defaultBudget: string;
    public resume: string;
    public gearList: string;
    public imdbId: string;
    public reel: string;
    public personalWebSite: string;
    public biography: string;
    public unionTypeName: string;
    public enableWeeklyNewsletters: boolean;
    public notifyOnReviews: boolean;
    public notifyOnOldMessages: boolean;
    public gender: string;

    public showRefer: boolean;
    public showContactMe: boolean;
    public showHireMe: boolean;
    public showResume: boolean;
    public showGear: boolean;
    public companyPhone :string;
    public companyRole:string;
    public corporateStructure:string;
    public speciality :string;
}

export class PdfUploadResponse {
    public errors: string[];
    public error: boolean;
    public fileName: string;
}

export class ChangePasswordRequest {
    public currentPassword: string;
    public newPassword: string;
    public confirmPassword: string;
}


export class CompanyUpdatePersonalInfo {
    public profileSysId: string;
    public firstName: string;
    public lastName: string;
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipCode: string;
    public email: string;
    public phoneNumber: string;
    public gender: string;
    public companyPhone:string;
    public companyRole:string;
    public corporateStructure:string;
    public Speciality :string;
    public UpdatePortfolio: CompanyUpdatePortfolio;
}

export class CompanyUpdatePortfolio {
    public profileSysId: string;
    public profileImageUrl: string;
    public crewRoles: string[];
    public profileCities: string[];
    public dietaryRestrictions: string;
    public allergies: string;
    public acceptsUltraLowBudget: boolean;
    public acceptsIndustryScale: boolean;
    public acceptsLowBudget: boolean;
    public acceptsUnionRates: boolean;
    public defaultBudget: string;
    public resume: string;
    public gearList: string;
    public imdbId: string;
    public reel: string;
    public personalWebSite: string;
    public biography: string;
    public unionTypeName: string;
    public enableWeeklyNewsletters: boolean;
    public notifyOnReviews: boolean;
    public notifyOnOldMessages: boolean;
    public showRefer: boolean;
    public showContactMe: boolean;
    public showHireMe: boolean;
    public showResume: boolean;
    public showGear: boolean;
    public ShowHistory: boolean;
    public companyRole:string;
    public companyPhone:string;
    public corporateStructure:string;
    public speciality :string;
}