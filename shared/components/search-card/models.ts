import { environment } from "environments/environment";

export class SearchCard {
    public profileSysId: string;
    public profileImageUrl: string;
    public fullName: string;
    public crewRoles: string[];
    public budgets: string[];
    public location: string;
    public reliability: number;
    public craftsmanship: number;
    public communication: number;
    public attitude: number;
    public industryScore: number;
    public userProfileUrlDisplayName: number;
    public locationType: LocationType;
    public static SetProfileImageUrl(cards: SearchCard[]) {
        for (let card of cards) {
            if (card.profileImageUrl) {
                card.profileImageUrl = environment.site.imageUrl(card.profileImageUrl);
            }
            else {
                card.profileImageUrl = '../assets/images/avatars/avatar-md.png';
            }
        }
    }
}

export enum LocationType{
    CurrentLocation = 1,
    WorkingLocation = 2
}