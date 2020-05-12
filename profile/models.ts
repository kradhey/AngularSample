import { environment } from 'environments/environment';
import { Budget, BudgetStatusTypes } from 'shared/services/Budget';
import { utils } from 'shared/view/video';
import { ProfileStatusTypes } from 'shared/services/ProfileStatusTypes';

export const DefaultPageSize: number = 6;
export const ReviewsOnOverview: number = 3;

export enum ReviewStatusTypes {
    Visible = 1,
    Invisible = 2,
    Deleted = 3
}

function getYouTubeImage(id) {
    return environment.site.video.youTubeThumbnail(id);
}

function getYouTubeVideo(id) {
    return environment.site.video.youTubeVideo(id);
}

function getVimeoVideo(id) {
    return environment.site.video.vimeoVideo(id);
}

export class BehindScenePic {

    public id:number;
    public behindTheScenePic:string;
    public profile_Id:number;  
  }

export class ProfilePage {
    public profileSysId: string;
    public profileImageUrl: string;
    public coverPhoto:string;
    public fullName: string;
    public hireableCrewRoles: string;
    public location: string;
    public biography: string;
    public defaultBudget: string;

    public industryScore: number;
    public avgReview: number;
    public reliability: number;
    public craftsmanship: number;
    public communication: number;
    public attitude: number;

    public imdbUrl: string;
    public resumeFileName: string;
    public gearFileName: string;
    public reelId: string;
    public reelType: string;
    public reel: string;
    public personalWebSite: string;

    public showRefer: boolean;
    public showContactMe: boolean;
    public showHireMe: boolean;
    public showHistory: boolean;

    public isOwnProfile: boolean;
    public isComplete: boolean;
    public canReview: boolean;
    public showResume: boolean;
    public showGear: boolean;
    public unionTypeId: number;
    public unionImgSrc: string;
    public unionTypeName: string;
    public projects: CardResponse<ProjectCardResponse>;
    public reviews: CardResponse<ReviewCard>;
    public profileHistory: ProfileHistoryResponse;
    public joinDate: string;
    public speciality: string
    public specialityImgSrc: string;
    public budgetNotification: boolean;
    public budgetStatus: BudgetStatusTypes;
    public organizations:Organization[];
    public userProfileUrlDisplayName: string;

    public static Initialize(page: ProfilePage) {
        if (!page.reelId) {
            return;
        }

        if (page.reelType == 'YouTube') {
            page.reel = getYouTubeVideo(page.reelId);
        }
        else if (page.reelType == 'Vimeo') {
            page.reel = getVimeoVideo(page.reelId);
        }
    }
}

export class Reviewer {
    public profileImageName: string;
    public profileImageUrl: string;
    public profileSysId: string;
    public fullName: string;
    public crewRoles: string;
    public socialUserId?: number

    public isSocialReview: boolean;
    public link: any;
    public userProfileUrlDisplayName: string;
    public static Initialize(reviewer: Reviewer, profileFullName?: string) {
        Reviewer.SetProfileImageUrl(reviewer);

        reviewer.isSocialReview = !reviewer.profileSysId;
        if (reviewer.isSocialReview) {
            if (reviewer.userProfileUrlDisplayName == "") {
                reviewer.userProfileUrlDisplayName = profileFullName;
            }
            reviewer.link = ['/profile', reviewer.userProfileUrlDisplayName];
        }
        else {
            
            reviewer.link = ['/profile', reviewer.userProfileUrlDisplayName];
        }
    }

    private static SetProfileImageUrl(reviewer: Reviewer) {
        if (reviewer.profileImageName) {
            reviewer.profileImageUrl = environment.site.imageUrl(reviewer.profileImageName);
        }
        else {
            reviewer.profileImageUrl = "../../assets/images/avatars/avatar-md.png";
        }
    }
}

export class Scores {
    public average: number;
    public attitude: number;
    public craftsmanship: number;
    public reliability: number;
    public communication: number;
}

export class Reviewee {
    public profileSysId: string;
    public crewRoles: string;
}

export class Organization
{
    public id:Number;
    public organizationName:string;
    public organizationPassCode:string;
    public type:number;
}



export class ReviewCard {
    public id: number;
    public reviewer: Reviewer;
    public reviewee: Reviewee;
    public scores: Scores;

    public title: string;
    public comments: string;
    public projectName: string;
    public status: ReviewStatusTypes;
    public isGeneralReview: boolean;
}

export class ReviewRequest {
    public id: number;
    public dateTime: string;
    public requestToFullName: string;
    public requestToSysId: string;
    public fullProjectTitle: string;
    public overviewUrl: string;
    public userProfileUrlDisplayName: string;
}

export class ProjectCardResponse {
    public id: number;
    public projectType: string;
    public title: string;
    public year: number;
    public crewRoles: string;
    public videoId: string;
    public videoType: string;
    public isFavorite: boolean;
    public hasReviews: boolean;
    public fullProjectTitle: string;
    public isActive: boolean;
}

export class ProjectCard extends ProjectCardResponse {
    public video: string;
    public thumbnail: string;

    public static Initialize(card) {
        if (card && !card.isActive) {
            card.video = null;
            card.thumbnail = "../assets/images/profile/video-unavailable.jpg";
        }
        else if (card && card.videoId && card.isActive) {
            if (card.videoType === 'YouTube') {
                card.video = getYouTubeVideo(card.videoId);
                card.thumbnail = getYouTubeImage(card.videoId);
            } else if (card.videoType == 'Vimeo') {
                card.video = getVimeoVideo(card.videoId);
                utils.getVimeoThumbnail(card.videoId, (r) => {
                    card.thumbnail = r;
                });
            }
        }
    }
}

export class CardResponse<T> {
    public cards: T[];
    public pager: PagerResponse;
    public request: PagerRequest;
}

export class PagerResponse {
    public pages: number;
    public current: number;
    public pageSize: number;
    public totalResults: number;
    public hasMore: boolean;
}

export class PagerRequest {
    public pageSize: number;
    public page: number;
}

export class ProfileHistoryResponse {
    public items: any[];
    public pager: PagerResponse;
}
