import { ProfileStatusTypes } from 'shared/services/ProfileStatusTypes';
import { environment } from 'environments/environment';

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
export class ProfileSettingsPage {
    public acceptsUltraLowBudget: boolean;
    public acceptsIndustryScale: boolean;
    public acceptsLowBudget: boolean;
    public acceptsUnionRates: boolean;
    public acceptStudentBudget: boolean;
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
    public latitude: any;
    public longitude: any;
    public email: string;
    public phoneNumber: string;
    public dietaryRestrictions: string;
    public allergies: string;
    public gender: string;
    public formattedAddress: string;
    public previousAddressLine1: string;

    public fullName: string;
    public dOB: string;
    public dobMonth?: number;
    public dobDay?: number;
    public dobYear?: number;
    public province: string;
    public county: string;
    public country: string;
    public aptSte: string;
    public countryCode:string;
    public stateCode:string;

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
    public projectsCount:number;
    public reviewsCount:number;
    public passCode:string;
    public workingCities: WorkingCity[];
    public static SetReelUrl(page: ProfileSettingsPage) {
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

export class UpdateProfileSettingsRequest {
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
export class BudgetList {
    label: string;
    name: string;
    value: any;
    disabled?: boolean;
}
export class Organizations {

    public organizationName: string;
  
    public organizationPassCode: string;
  }
  
export class UpdatePersonalInfo {
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
    public UpdatePortfolio: UpdatePortfolio;
}

export class UpdatePortfolio {
    public profileSysId: string;
    public profileImageUrl: string;
    public crewRoles: string[];
    public profileCities: string[];
    public dietaryRestrictions: string;
    public allergies: string;
    public acceptsUltraLowBudget: boolean;
    public acceptStudentBudget:boolean;
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
}

export class WorkingCity{
    public city: string;
    public state: string;
    public countryCode: string;
    public stateCode: string;
    public latitude: any;
    public longitude: any;
    public country: string;
    public isSelected: boolean;
    public formattedAddress: string;
}