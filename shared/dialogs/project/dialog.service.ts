import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export enum DialogAction {
    New = 1,
    Edit = 2
}

export interface IProjectDialogInput {
    action: DialogAction;
    data: any;
}

@Injectable()
export class ProjectDialogService {
    private showDialogSource = new Subject<IProjectDialogInput>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    newProject(profileSysId: string) {
        const action: IProjectDialogInput = {
            action: DialogAction.New,
            data: {profileSysId}
        };

        this.showDialogSource.next(action);
    }

    editProject(profileSysId: string, projectId: number) {
        const action: IProjectDialogInput = {
            action: DialogAction.Edit,
            data: {profileSysId, projectId}
        };

        this.showDialogSource.next(action);
    }
}