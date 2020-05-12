import { DialogHeader } from '../header/DialogHeader';

export class HireProfileDialog {
    public header: DialogHeader;
    public projectType: string;
    public rate: number;
    public rateType: string;
    public crewRoles: string[];
    public dates: string[];
    public message: string;
    public city: string;
    public state: string;
}

export class HireProfileRequest {
    public projectType: string;
    public rate: number;
    public rateType: string;
    public crewRoles: string[];
    public dates: string[];
    public message: string;
    public city: string;
    public state: string;
}

export class HireProfileRequestDisplay {
    public id :Number;
    public projectType: string;
    public rate: number;
    public rateType: string;
    public crewRoles: string;
    public dates: string;
    public message: string;
    public city: string;
    public state: string;
    public profileHireSysID:string;
    public profileToHireSysID:string;
    public contactcard:string;
    public isAcceptRequest:string
    public showTitle: boolean;
    public songTitle: string;
    public artistTitle: string;
    public episodeTitle: string;
    public seriesTitle: string;
    public projectName:string;
    public productionCompany:string;
}