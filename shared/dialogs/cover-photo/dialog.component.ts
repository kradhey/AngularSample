import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { Subscription } from 'rxjs/Subscription';

import { CoverPicService } from './cover-pic.service';
import { AuthService } from 'auth/auth.service';
import { ISiteApiResponse, SiteApiResponseUtilities,SiteApiResponseUtilitiesOrganization,SiteApiResponseUtilitiesPhoto } from 'shared/services/SiteApiResponse';
import {
  CoverPicDialogService,
  CoverPicDialogMode
} from 'shared/dialogs/cover-photo/dialog.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';

@Component({
  selector: 'ij-coverpic-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles.less'],
  providers: [CoverPicService]
})
export class CoverPicDialog implements OnInit, OnDestroy {
  private static CANVAS_WIDTH = 1200;
  private static CANVAS_HEIGHT =297;
  private static MOBILE_CANVAS_WIDTH = 300
  private static MOBILE_CANVAS_HEIGHT = 250
  private static CROPPER_WIDTH = 1200;
  private static CROPPER_HEIGHT = 297;
  private static CROPPER_MIN_WIDTH = 1200;
  private static CROPPER_MIN_HEIGHT = 297;

  private dlgMode: CoverPicDialogMode;

  private dlgSub: Subscription;
  private upSub: Subscription;

  public showSaveErrored: boolean;
  public disableSubmit: boolean;
  public dialogVisible: boolean;
  public cropperSettings: CropperSettings;
  public data: any;
  public errors: string[] = [];
  public coverSceneErrors:string[]=[];
  public errorList:boolean;
  private respUtilsCoverPhoto=new SiteApiResponseUtilitiesPhoto();
  @ViewChild('cropper') cropper: ImageCropperComponent;
  @Output() onSaved = new EventEmitter<string>();

  constructor(
    private picSvc: CoverPicService,
    private authSvc: AuthService,
    private dlgSvc: CoverPicDialogService,
    private spinner: NgxSpinnerService
  ) {



   }

  ngOnInit() {
    this.dlgSub = this.dlgSvc.showDialog$.subscribe(mode => {
      this.dlgMode = mode;
      this.show();
    });
  }

  ngOnDestroy() {
    if (this.dlgSub) {
      this.dlgSub.unsubscribe();
    }

    if (this.upSub) {
      this.upSub.unsubscribe();
    }
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  onFileChange(event) {
    this.imageChangedEvent = event;
    // this.showSpinner();
    // var image = new Image();
    // var file: File = $event.target.files[0];
    // var reader = new FileReader();

    // alert('On file change method called');
    // reader.onloadend = (loadEvent: any) => {
    //   image.src = loadEvent.target.result;
    //   alert('Image loaded');
    //   this.cropper.setImage(image);
    //   alert('Image Cropped called');
    //   this.hideSpinner();
    // };

    // reader.readAsDataURL(file);
  }






  onSave(e) {
    if (!this.croppedImage) {
      e.preventDefault();
      return;
    }

    if (this.dlgMode == CoverPicDialogMode.ExistingProfile) {
      this.upSub = this.picSvc.uploadProfilePicture(this.croppedImage).subscribe(r => this.onUploaded(r),r=>this.onBehindTheSceneSaveError(r));
    }
    else {
      this.onSaved.emit(this.croppedImage);
      this.hide();
    }
  }



  private onBehindTheSceneSaveError(error = null) {
    debugger;
    if (typeof (error) === "string") {
        this.errors.push(error);
    } else {
        if (error) {
          debugger;
            this.coverSceneErrors = this.respUtilsCoverPhoto.getErrors(error);
        }
    }
    this.errorList=true;
    this.show();
    // this.oragnisationValidation="Error";
 }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper
    this.show()
  }
  loadImageFailed() {
    // show message
  }

  private show() {
    this.initImageCropper();
    this.dialogVisible = true;
  }

  private hide() {
    this.dialogVisible = false;
  }

  private onUploaded(data) {
    this.authSvc.profileImageCoverPhoto = data.thumbnailImageName;
    this.onSaved.emit(this.croppedImage);
    this.hide();
  }

  private initImageCropper(): void {
   
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = CoverPicDialog.CROPPER_WIDTH;
    this.cropperSettings.height = CoverPicDialog.CROPPER_HEIGHT;

    this.cropperSettings.croppedWidth = CoverPicDialog.CROPPER_WIDTH;
    this.cropperSettings.croppedHeight = CoverPicDialog.CROPPER_HEIGHT;

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (screen.width <= 480 || isMobile) {
      this.cropperSettings.canvasWidth = CoverPicDialog.MOBILE_CANVAS_WIDTH;
      this.cropperSettings.canvasHeight = CoverPicDialog.MOBILE_CANVAS_HEIGHT;

    }
    else {
      this.cropperSettings.canvasWidth = CoverPicDialog.CANVAS_WIDTH;
      this.cropperSettings.canvasHeight = CoverPicDialog.CANVAS_HEIGHT;

    }

    this.cropperSettings.minWidth = CoverPicDialog.CROPPER_MIN_WIDTH;
    this.cropperSettings.minHeight = CoverPicDialog.CROPPER_MIN_HEIGHT;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.preserveSize = false;
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 1;
    this.cropperSettings.fileType = 'image/jpeg';
    this.data = {};
  }
}