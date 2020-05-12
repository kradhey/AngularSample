import { environment } from 'environments/environment';
import { BudgetStatusTypes } from 'shared/services/Budget';

export class DialogHeader {
    public fullName: string;
    public hireableCrewRoles: string;
    public location: string;
    public defaultBudget: string;
    public industryScore: number;
    public profileImageName: string;
    public profileImageUrl: string;
    public email: string;
    public budgetStatus: BudgetStatusTypes;
    public budgetNotification: boolean;
    public projectCount: number;
    public reviewCount: number;
    public biography: string;
    public userProfileUrlDisplayName: string;
    public static SetProfileImageUrl(header: DialogHeader) {
        if (header.profileImageName) {
            header.profileImageUrl = environment.site.imageUrl(header.profileImageName);
        }
        else {
            header.profileImageUrl = "/assets/images/avatars/avatar-md.png";
        }
    }
}