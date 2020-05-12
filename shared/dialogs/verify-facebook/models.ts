import { DialogHeader } from '../header/DialogHeader';
import { ProjectCardResponse } from 'profile/models';

export class ReviewFormData {
    constructor (
        public reliability: number,
        public craftsmanship: number,
        public communication: number,
        public attitude: number,
        public adjective1: string,
        public adjective2: string,
        public adjective3: string,
        public projectId: number,
        public comments: string,
        public reviewerCrewRoles: string[],
        public socialUserId: number,
        public requestId: string
    ) { }
}

export class ProjectItem {
    constructor (
        public label: string,
        public value: string
    ) { }
}

export class ReviewRequestIdentifier {
    public socialUserId?: number;
    constructor (
        public requestId: string,
        public revieweeId: string
    ) { }
}

export class VerifyFacebookDialog {
    constructor(defaultScore: number = 0) {
        this.reliability = defaultScore;
        this.craftsmanship = defaultScore;
        this.communication = defaultScore;
        this.attitude = defaultScore;
    }

    public reliability: number;
    public craftsmanship: number;
    public communication: number;
    public attitude: number;

    public adjective1: string;
    public adjective2: string;
    public adjective3: string;

    public reviewerCrewRoles: string[];
    public projectId: number;
    public comments: string;

    public header: DialogHeader;
    public projects: ProjectItem[];
    public socialUserId?: number;
    public project: ProjectCardResponse
}
