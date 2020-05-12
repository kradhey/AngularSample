import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
    selector: 'ij-cookies-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class CookiesDialogComponent implements OnInit {
    dialogVisible: boolean;
    @ViewChild('cookieLaw')
    private cookieLawEl: any;
    constructor() {
    }

    ngOnInit(){
        // if (window.screen.availWidth <= 760) {
        //     this.cookieLawEl.position="top";
        // }
        // else{
        //     this.cookieLawEl.position="bottom";
        // }
    }

    public dismiss(): void {
        this.cookieLawEl.dismiss();
    }
}