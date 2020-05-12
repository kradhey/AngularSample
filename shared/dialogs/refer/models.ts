import { DialogHeader } from '../header/DialogHeader';

export class ReferDialog {
    public header: DialogHeader;
    public message: string;
    public emails: string;
    public profileSysIds: string[];
    public fullName: string;
    public showEmail: boolean;
    public currentProfileSysId: string;
}

export class ReferRequest {
    public profileSysIds: string[];
    public emails: string[];
    public message: string;
    public fullName: string;
}