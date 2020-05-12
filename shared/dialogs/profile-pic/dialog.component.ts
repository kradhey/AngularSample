import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { Subscription } from 'rxjs/Subscription';

import { ProfilePicService } from './profile-pic.service';
import { AuthService } from 'auth/auth.service';

import {
  ProfilePicDialogService,
  ProfilePicDialogMode
} from 'shared/dialogs/profile-pic/dialog.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';

@Component({
  selector: 'ij-profilepic-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles.less'],
  providers: [ProfilePicService]
})
export class ProfilePicDialog implements OnInit, OnDestroy {
  private static CANVAS_WIDTH = 400;
  private static CANVAS_HEIGHT = 350;
  private static MOBILE_CANVAS_WIDTH = 300
  private static MOBILE_CANVAS_HEIGHT = 250
  private static CROPPER_WIDTH = 211;
  private static CROPPER_HEIGHT = 215;
  private static CROPPER_MIN_WIDTH = 211;
  private static CROPPER_MIN_HEIGHT = 215;

  private dlgMode: ProfilePicDialogMode;

  private dlgSub: Subscription;
  private upSub: Subscription;

  public showSaveErrored: boolean;
  public disableSubmit: boolean;
  public dialogVisible: boolean;
  public cropperSettings: CropperSettings;
  public data: any;

  @ViewChild('cropper') cropper: ImageCropperComponent;
  @Output() onSaved = new EventEmitter<string>();

  constructor(
    private picSvc: ProfilePicService,
    private authSvc: AuthService,
    private dlgSvc: ProfilePicDialogService,
    private spinner: NgxSpinnerService
  ) { }

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

    if (this.dlgMode == ProfilePicDialogMode.ExistingProfile) {
      this.upSub = this.picSvc.uploadProfilePicture(this.croppedImage).subscribe(r => this.onUploaded(r));
    }
    else {
      this.onSaved.emit(this.croppedImage);
      this.hide();
    }
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
    this.authSvc.thumbnailImageName = data.thumbnailImageName;
    this.onSaved.emit(this.croppedImage);
    this.hide();
  }

  private initImageCropper(): void {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = ProfilePicDialog.CROPPER_WIDTH;
    this.cropperSettings.height = ProfilePicDialog.CROPPER_HEIGHT;

    this.cropperSettings.croppedWidth = ProfilePicDialog.CROPPER_WIDTH;
    this.cropperSettings.croppedHeight = ProfilePicDialog.CROPPER_HEIGHT;

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (screen.width <= 480 || isMobile) {
      this.cropperSettings.canvasWidth = ProfilePicDialog.MOBILE_CANVAS_WIDTH;
      this.cropperSettings.canvasHeight = ProfilePicDialog.MOBILE_CANVAS_HEIGHT;

    }
    else {
      this.cropperSettings.canvasWidth = ProfilePicDialog.CANVAS_WIDTH;
      this.cropperSettings.canvasHeight = ProfilePicDialog.CANVAS_HEIGHT;

    }

    this.cropperSettings.minWidth = ProfilePicDialog.CROPPER_MIN_WIDTH;
    this.cropperSettings.minHeight = ProfilePicDialog.CROPPER_MIN_HEIGHT;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = true;
    this.cropperSettings.preserveSize = false;
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 1;
    this.cropperSettings.fileType = 'image/jpeg';
    this.data = {};
  }
}