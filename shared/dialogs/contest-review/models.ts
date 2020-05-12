import { DialogHeader } from "shared/dialogs/header/DialogHeader";

export class ContestReviewDialog {
    public id: number;
    public reviewer: DialogHeader;
    public reviewee: DialogHeader;
    public scores: ContestScores;
    public title: string;
    public projectName: string;
    public comments: string;
    public reason: string;
    public reviewType: ReviewTypes;
}

export class ContestReviewDialogResponse {
    public id: number;
    public reviewer: DialogHeader;
    public reviewee: DialogHeader;
    public scores: ContestScores;
    public title: string;
    public projectName: string;
    public comments: string;
}

export class ContestScores {
    public reliability: number;
    public craftsmanship: number;
    public communication: number;
    public attitude: number;
}


export enum ReviewTypes{
    Profile = 1,
    SocialUser = 2
}

