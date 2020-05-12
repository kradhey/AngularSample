import { DialogHeader } from '../header/DialogHeader';

export class ProjectItem {
    constructor (
        public label: string,
        public value: string
    ) { }
}

export class ReviewRequestDialog {
    public header: DialogHeader;
    public projectId: number;
    public email: string;
    public profileSysId: string;
    public projects: ProjectItem[];
    public showEmail: boolean;
    public fullName :string;
}

export class ReviewRequest {
    constructor(
        public fullName : string,
        public profileSysId: string,
        public email: string
    ) { }
}