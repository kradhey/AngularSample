import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'ij-duplicate-review-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class DuplicateReviewComponent {
    dialogVisible: boolean;
    public projectName: string;
    public title: string;
    public message: string;
    constructor() {
    }
    showDialog() {
        this.dialogVisible = true;
    }

    hideDialog() {
        this.dialogVisible = false;
    }
}