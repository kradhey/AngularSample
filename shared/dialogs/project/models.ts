import { DialogHeader } from '../header/DialogHeader';

export class ProjectDialog {
    public id: number;
    public header: DialogHeader;
    public projectName: string;
    public projectType: string;
    public crewRoles: string[]
    public releaseYear: number;
    public budgetRange: string;
    public url: string;
    public city: string;
    public state: string;
    public stateCode: string;
    public country: string;
    public countryCode: string;
    public latitude: any;
    public longitude: any;
    public location: string;
    public showTitle: boolean;
    public productionCompany: string;
    public songTitle: string;
    public artistTitle: string;
    public episodeTitle: string;
    public seriesTitle: string;

}

export class NewProjectRequest {
    public projectName: string;
    public projectType: string;
    public crewRoles: string[]
    public releaseYear: number;
    public budgetRange: string;
    public url: string;
    public productionCompany: string;
    public city: string;
    public state: string;
    public stateCode: string;
    public country: string;
    public countryCode: string;
    public latitude: any;
    public longitude: any;
    public showTitle: boolean;
    public songTitle: string;
    public artistTitle: string;
    public episodeTitle: string;
    public seriesTitle: string;
}

export class EditProjectRequest {
    public id: number;
    public projectName: string;
    public projectType: string;
    public crewRoles: string[]
    public releaseYear: number;
    public budgetRange: string;
    public url: string;
    public productionCompany: string;
    public city: string;
    public state: string;
    public stateCode: string;
    public country: string;
    public countryCode: string;
    public latitude: any;
    public longitude: any;
    public showTitle: boolean;
    public songTitle: string;
    public artistTitle: string;
    public episodeTitle: string;
    public seriesTitle: string;
}
