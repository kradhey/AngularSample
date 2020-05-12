import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { Subscription } from 'rxjs/Subscription';

import { BehindScenePicService } from './behind-scene-pic.service';
import { AuthService } from 'auth/auth.service';
import { Helpers } from '../../dom/Helper';
import { ISiteApiResponse, SiteApiResponseUtilities,SiteApiResponseUtilitiesOrganization,SiteApiResponseUtilitiesPhoto } from 'shared/services/SiteApiResponse';
import {
  BehindScenePicDialogService,
  BehindScenePicDialogMode
} from 'shared/dialogs/behind-the-scene/dialog.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { empty } from 'rxjs/observable/empty';

@Component({
  selector: 'ij-behind-Scene-pic-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles.less'],
  providers: [BehindScenePicService]
})
export class BehindScenePicDialog implements OnInit, OnDestroy {
  
  public myfile:any[];
public   uploadedFiles: any[] = [];

  private static CANVAS_WIDTH = 500;

  private static CANVAS_HEIGHT = 350;
  private static MOBILE_CANVAS_WIDTH = 300
  private static MOBILE_CANVAS_HEIGHT = 250
  private static CROPPER_WIDTH = 500;
  private static CROPPER_HEIGHT = 350;
  private static CROPPER_MIN_WIDTH = 500;
  private static CROPPER_MIN_HEIGHT = 350;
  public errors: string[] = [];
  public behineSceneErrors:string[]=[];
  private dlgMode: BehindScenePicDialogMode;

  private dlgSub: Subscription;
  private upSub: Subscription;

  public showSaveErrored: boolean;
  public disableSubmit: boolean;
  public dialogVisible: boolean;
  public cropperSettings: CropperSettings;
  public data: any;
  public errorList:boolean;

  private respUtilsBehindTheScene=new SiteApiResponseUtilitiesPhoto();
  @ViewChild('cropper') cropper: ImageCropperComponent;
  @Output() onSaved = new EventEmitter<string>();

  constructor(
    private picSvc: BehindScenePicService,
    private authSvc: AuthService,
    private dlgSvc: BehindScenePicDialogService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.dlgSub = this.dlgSvc.showDialog$.subscribe(mode => {
      this.dlgMode = mode;
      // this.uploadedFiles=null;
      debugger;
    
      this.show();
      this.errorList=false;
 
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

  onSave(event) {
    debugger;
    Helpers.setLoading(true);
    for(let file of event.files) {
      debugger
      this.uploadedFiles.push(file);
  }
     this.upSub = this.picSvc.uploadProfilePicture(this.uploadedFiles).subscribe(r => {
      Helpers.setLoading(false);
       this.onUploaded(r)
       this.behineSceneErrors=null;
       this.uploadedFiles.length=0;
      },
      r=>this.onBehindTheSceneSaveError(r)  
    );
    this.hide();
    }



    private onBehindTheSceneSaveError(error = null) {
      debugger;
      if (typeof (error) === "string") {
          this.errors.push(error);
      } else {
          if (error) {
            debugger;
              this.behineSceneErrors = this.respUtilsBehindTheScene.getErrors(error);
          }
      }
      this.errorList=true;
      this.myfile=[];
      this.uploadedFiles=[];
      Helpers.setLoading(false);
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
    // this.authSvc.thumbnailImageName = data.thumbnailImageName;
    this.onSaved.emit(this.croppedImage);
    this.hide();
  }

  private initImageCropper(): void {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = BehindScenePicDialog.CROPPER_WIDTH;
    this.cropperSettings.height = BehindScenePicDialog.CROPPER_HEIGHT;

    this.cropperSettings.croppedWidth = BehindScenePicDialog.CROPPER_WIDTH;
    this.cropperSettings.croppedHeight = BehindScenePicDialog.CROPPER_HEIGHT;

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (screen.width <= 480 || isMobile) {
      this.cropperSettings.canvasWidth = BehindScenePicDialog.MOBILE_CANVAS_WIDTH;
      this.cropperSettings.canvasHeight = BehindScenePicDialog.MOBILE_CANVAS_HEIGHT;

    }
    else {
      this.cropperSettings.canvasWidth = BehindScenePicDialog.CANVAS_WIDTH;
      this.cropperSettings.canvasHeight = BehindScenePicDialog.CANVAS_HEIGHT;

    }

    this.cropperSettings.minWidth = BehindScenePicDialog.CROPPER_MIN_WIDTH;
    this.cropperSettings.minHeight = BehindScenePicDialog.CROPPER_MIN_HEIGHT;

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