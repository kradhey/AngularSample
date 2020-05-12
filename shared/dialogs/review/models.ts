import { DialogHeader } from '../header/DialogHeader';

export class ReviewProfileRequest {
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
        public reviewerCrewRoles: string[]
    ) { }
}

export class ProjectItem {
    constructor (
        public label: string,
        public value: string
    ) { }
}

export class ReviewProfileDialog {
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
}