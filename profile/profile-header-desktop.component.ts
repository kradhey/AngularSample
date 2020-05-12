import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage,BehindScenePic } from './models';
import { BaseProfileComponent } from './BaseProfileComponent';
import { ContactProfileDialogService } from 'shared/dialogs/contact/dialog.service';
import { HireProfileDialogService } from 'shared/dialogs/hire/dialog.service';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { ConfirmationService } from 'primeng/primeng';
import { ExternalUrlDialogService } from 'shared/dialogs/external-url/dialog.service';
import { GalaryDialogService } from 'shared/dialogs/galary-dialog/dialog.service'
import { AuthService } from 'auth/auth.service';
import { ChatConfig } from 'chat/config';
import { environment } from 'environments/environment';
import { ProfileService } from '../profile/profile.service'
@Component({
    selector: 'ij-profile-header-desktop',
    templateUrl: 'profile-header-desktop.component.html',
    styleUrls: ['./styles/header-desktop.less'],
    providers: [ConfirmationService]
})
export class ProfileHeaderDesktopComponent extends BaseProfileComponent {
    private externalWebsite: string;
    public  images:any[];
    public imagesData=[];
    public imageList:BehindScenePic[];
    display:boolean=false;
    nonUserMessage: string = "We only allow logged in users refer, contact and hire. Please login or create an account";
    constructor(
        route: ActivatedRoute,
        router: Router,
        private contactDlg: ContactProfileDialogService,
        private hireDlg: HireProfileDialogService,
        private referDlg: ReferProfileDialogService,
        private confirmSvc: ConfirmationService,
        private externalUrlDialog: ExternalUrlDialogService,
        private galaryDialogService: GalaryDialogService,
        private authSvc: AuthService,
        private profileSvc:ProfileService
    ) {
        super(route, router);
        this.images = [];
              this.profileSvc.getBehindTheScene().subscribe(pic=>
                {
                    this.imageList=pic;
                    this.imageList.forEach(element => {

                        this.images.push(environment.site.imageUrl(element.behindTheScenePic));
                   
                    });
                    
                })

            
      }
    
 
ok()
{
    this.display=true;
}
    getCoverImageUrl()
    {
        if (this.authSvc.profileImageCoverPhoto) {
            return environment.site.imageUrl(this.authSvc.profileImageCoverPhoto);
        }
        else if(this.model.coverPhoto) {
            return environment.site.imageUrl(this.model.coverPhoto);
        }
        else {
            return "../../assets/images/profile/profile-bg.jpg";
        }
        
    }
    showGalary()
    {
        debugger
        this.galaryDialogService.showDialog(this.images);
    }
    getImagesList()
    {
     
        return this.images;

    }





    get reviewLabel() {
        if (this.model.reviews != null && this.model.reviews.cards.length == 1) {
            return "Review";
        }

        return "Reviews";
    }

    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    gotoExternalSite(site) {
        this.externalUrlDialog.showDialog(site);
    }

    onContact() {
        if (this.isLoggedIn) {
            this.contactDlg.showDialog(this.model.profileSysId, ChatConfig.BASE_CONNECTION);
        }
        else {
            this.confirmSvc.confirm({
                message: this.nonUserMessage,
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    onRefer() {
        if (this.isLoggedIn) {
            this.referDlg.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: this.nonUserMessage,
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }

    onHire() {
        if (this.isLoggedIn) {
            this.hireDlg.showDialog(this.model.profileSysId);
        }
        else {
            this.confirmSvc.confirm({
                message: this.nonUserMessage,
                header: "Login Required",
                rejectVisible: false,
            });
        }
    }
}