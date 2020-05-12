import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ProjectDialog, NewProjectRequest, EditProjectRequest } from './models';
import { ISubscription } from 'rxjs/Subscription';

import { ProjectDialogService, IProjectDialogInput, DialogAction } from './dialog.service';
import { DialogHeaderService } from '../header/dialog-header.service';
import { ProjectService } from './project.service';
import { CrewRole } from 'shared/services/CrewRole';
import { LookupService } from 'shared/services/lookup.service';
import { BaseDialogComponent } from '../BaseDialogComponent';
import { masks } from 'shared/view/masks';
import { constants } from 'environments/constants';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { NotificationsService } from 'angular2-notifications';

import { QuickSearchItem } from '../../components/quick-search/QuickSearchItem';
import { QuickSearchService } from '../../components/quick-search/quick-search.service';
import { BudgetLevelService } from './../budget-level/budget-level.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { environment } from "environments/environment";
import { ProjectCard } from "profile/models";
import { BudgetDetails } from './../budget-level/models';
import { Address } from '../../../../node_modules/ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'ij-project-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles.less'],
  providers: [ProjectService, BudgetLevelService]
})
export class ProjectDialogComponent extends BaseDialogComponent<ProjectDialog> implements OnDestroy {
  public allCrewRoles: CrewRole[] = [];
  public crewRoleSuggestions: string[] = [];
  public budgetRanges: string[] = [];
  public allProjectTypes: string[] = [];
  public allSongTitles: any = [];
  public allEpisodeTitles: string[] = [];
  public projectTypeSuggestions: string[] = [];
  public songTitleSuggestions: any = [];
  public suggestions: any = [];
  public episodeTitleSuggestions: any = [];
  public yearMask = masks.year;
  private googleComponentForm: any;
  public PprojectName: any;
  private dialogSub: ISubscription;
  private projectSub: ISubscription;
  private headerSub: ISubscription;
  private crewSub: ISubscription;
  public projectModel: BudgetDetails;
  public states = [];
  private qs$ = new Subject<string>();
  private sub: ISubscription;
  public input: string = null;
  public projectType: string = "empty";
  public isProjectEdit: boolean = false;
  public isProjectAdd: boolean = true;
  public projectId: number;
  public newModeType: any;
  public newEpisodeTitle: any;
  public newSongTitle: any;
  public isAdd: boolean = true;
  public oldProjectCount: number;
  public oldReviewCount: number;
  public formattedLocation;
  public updatedLocation;
  protected get SaveMessage() {
    return "Your project has been added.";
  }
  @ViewChild("f") autoform;
  constructor(
    el: ElementRef,
    private dialogSvc: ProjectDialogService,
    private projectSvc: ProjectService,
    private lookupSvc: LookupService,
    private headerSvc: DialogHeaderService,
    public budgetSvc: BudgetLevelService,
    notificationSvc: NotificationsService
  ) {
    super(ProjectDialog, el, notificationSvc);
    this.states = lookupSvc.getStates();
    this.googleComponentForm = this.lookupSvc.googleAutoCompleteForm;
    this.dialogSub = this.dialogSvc.showDialog$.subscribe(input => {
      this.getLocalDropdowns();
      this.getCrewRoles();



      if (input.action == 2) {
        this.isAdd = false;
        this.showDialog();
        this.projectSvc
          .editProject(input.data.projectId)
          .subscribe
          (
          r => {
            this.isProjectEdit = true;
            this.isProjectAdd = false;
            this.model.projectName = r.projectName;
            this.projectType = r.projectType;

            this.disableUpdateSubmit = false;

            setTimeout(() => {

              if (this.model.projectType != "Web Series" && this.model.projectType != "Television Show" && this.model.projectType != "Music Video") {
                //this.newModeType = r.projectName;
                this.newModeType = this.model;
              }

              if (this.model.projectType == "Web Series" || this.model.projectType == "Television Show") {
                //this.newEpisodeTitle = this.model.episodeTitle;
                this.newEpisodeTitle = this.model;
              }

              if (this.model.projectType == "Music Video") {
                // this.newSongTitle = this.model.songTitle;
                this.newSongTitle = this.model;
              }
            }, 500);


            var role = [];
            this.model = r;
            this.projectId = r.id;

            ProjectCard.Initialize(r);

            if (r.videoType === 'YouTube') {
              this.model.url = environment.site.video.youTubeVideo(r.videoId);
            }
            else if (r.videoType == 'Vimeo') {
              this.model.url = environment.site.video.vimeoVideo(r.videoId);
            }

            var splitRole = r.crewRoles.split(",");
            for (var i = 0; i < splitRole.length; i++) {

              var roleIndex = this.allCrewRoles.map((el) => el.label).indexOf(splitRole[i].trim())
              this.crewRoleSuggestions = this.allCrewRoles
                .filter(f => f.label.toLocaleLowerCase().indexOf(splitRole[i].trim().toLocaleLowerCase))
                .map(r => r.label);

              role.push(this.crewRoleSuggestions[roleIndex]);

            }
            this.model.crewRoles = role;
          },
          e => this.onSaveError(e)
          );
      }
      else {
        this.newModeType = undefined;
        this.isAdd = true;
        this.isProjectAdd = true;
        this.resetForm(input.data.profileSysId);
        this.buildModel()
      }
    });
  }

  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }

    if (this.projectSub) {
      this.projectSub.unsubscribe();
    }

    if (this.headerSub) {
      this.headerSub.unsubscribe();
    }

    if (this.crewSub) {
      this.crewSub.unsubscribe();
    }
  }

  onCrewRolesKeyDown(event) {
    if (this.model.crewRoles && this.model.crewRoles.length >= constants.roles.maxRoles) return [];

    let query = (event.query || "").toLocaleLowerCase();

    this.crewRoleSuggestions = this.allCrewRoles
      .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r.label);
  }

  onProjectTypesKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.projectTypeSuggestions = this.allProjectTypes
      .filter(f => f.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r);

  }

  hasUserFromSystem(value) {

    this.model.showTitle = true;

    if (typeof value === 'string' || value instanceof String) {
      this.model.projectName = value.toString()
    }
    else {
      //  this.model.showTitle = !value;
      ProjectCard.Initialize(value);
      this.model = value;
      var role = [];
      value.crewRoles.replace(/[\[\]']+/g, '');
      var splitRole = value.crewRoles.split(",");
      for (var i = 0; i < splitRole.length; i++) {

        var roleIndex = this.allCrewRoles.map((el) => el.label).indexOf(splitRole[i].trim())
        this.crewRoleSuggestions = this.allCrewRoles
          .filter(f => f.label.toLocaleLowerCase().indexOf(splitRole[i].trim().toLocaleLowerCase))
          .map(r => r.label);

        role.push(this.crewRoleSuggestions[roleIndex]);

      }
      this.model.crewRoles = [];
      this.model.url = value.video;

    }
  }

  selectProjectType(event) {

    this.projectType = event;

  }

  selectSongTitle(value) {
    ProjectCard.Initialize(value);
    this.model = value;
    this.model.crewRoles = [];
    this.model.url = value.video;
  }

  onSongTitleKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.getSongTitles(query, this.model.projectType);
  }

  selectEpisodeTitle(value) {
    ProjectCard.Initialize(value);
    this.model = value;
    this.model.crewRoles = [];
    this.model.url = value.video;
  }

  onEpisodeTitleKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.getEpisodeTitles(query, this.model.projectType);
  }

  //////////////////////////////////////////


  onKeyDown(event) {
    let query = (event.query || event).toLocaleLowerCase();

    this.projectsByTitle(query, this.model.projectType);
  }

  onSelect(value) {
    // this.componentHasValue.emit(event);

    setTimeout(() => {
      if (this.model.projectType != "Web Series" && this.model.projectType != "Television Show" && this.model.projectType != "Music Video") {
        //this.newModeType = r.projectName;
        this.newModeType = value;
        this.newEpisodeTitle = undefined;
        this.newSongTitle = undefined;
      }

      if (this.model.projectType == "Web Series" || this.model.projectType == "Television Show") {
        //this.newEpisodeTitle = this.model.episodeTitle;
        this.newModeType = undefined;
        this.newSongTitle = undefined;
        this.newEpisodeTitle = value;
      }

      if (this.model.projectType == "Music Video") {
        this.newModeType = undefined;
        this.newEpisodeTitle = undefined;
        this.newSongTitle = value;
      }
    }, 500);


    ProjectCard.Initialize(value);
    this.model = value;
    this.model.crewRoles = [];
    this.model.url = value.video;

  }

  onKey(event) {

  }

  handleAddressBlur() {
    if (!this.model.city) {
      this.model.location = '';
    }
  }

  onNext() {
    if (this.model.city != this.formattedLocation) {
      this.clearAddressFields();
    }

    if (!this.model.city) {
      this.model.location = this.formattedLocation;
      this.model.city = this.model.location;
    }

  }

  public handleAddressChange(place: Address) {
    this.clearAddressFields();
    this.formattedLocation = "";
    this.updatedLocation = "";
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      if (this.googleComponentForm[addressType]) {
        let val = place.address_components[i][this.googleComponentForm[addressType]];

        if (addressType == 'locality') {
          this.model.city = val;
        }
        else if (addressType == 'administrative_area_level_1') {
          this.model.state = val;
          this.model.stateCode = place.address_components[i]['short_name'];
        }
        else if (addressType == 'country') {
          this.model.country = val;
          this.model.countryCode = place.address_components[i]['short_name'];
        }
      }
    }
    this.model.latitude = place.geometry.location.lat();
    this.model.longitude = place.geometry.location.lng();

    this.model.location = this.model.city;
    if (this.model.stateCode) {
      this.model.location = `${this.model.location}, ${this.model.stateCode}`;
    }
    if (this.model.countryCode) {
      this.model.location = `${this.model.location}, ${this.model.countryCode}`;
    }
  }

  private clearAddressFields() {
    this.model.city = '';
    this.model.state = '';
    this.model.country = '';
    this.model.stateCode = '';
    this.model.countryCode = '';
    this.model.location = '';
    this.model.latitude = null;
    this.model.longitude = null;
  }
  /////////////////////////////////////////







  protected onClear() {
    this.model = new ProjectDialog();
    this.model.projectType = this.projectType;
  }

  protected onSend() {
    if (this.formattedLocation) {
      this.onNext();
    }

    if (!this.model.city || !this.model.location) {
      this.disableSubmit = false;
      return;
    }
    const req = new NewProjectRequest();

    req.budgetRange = this.model.budgetRange;
    req.crewRoles = this.model.crewRoles;
    req.projectType = this.model.projectType;
    req.releaseYear = this.model.releaseYear;
    req.productionCompany = this.model.productionCompany;
    req.city = this.model.city;
    req.state = this.model.state;
    req.stateCode = this.model.stateCode;
    req.country = this.model.country;
    req.countryCode = this.model.countryCode;
    req.latitude = this.model.latitude;
    req.longitude = this.model.longitude;
    req.url = this.model.url;
    req.seriesTitle = this.model.seriesTitle;
    req.artistTitle = this.model.artistTitle;
    if (this.newModeType != undefined) {
      if (this.newModeType.projectName == undefined) {
        req.projectName = this.newModeType;
      }
      else {
        req.projectName = this.newModeType.projectName;
      }
    }
    else {
      req.projectName = "";
    }

    if (this.newEpisodeTitle != undefined) {
      if (this.newEpisodeTitle.episodeTitle == undefined) {
        req.episodeTitle = this.newEpisodeTitle;
      }
      else {
        req.episodeTitle = this.newEpisodeTitle.episodeTitle;
      }
    }
    else {
      req.episodeTitle = "";
    }
    if (this.newSongTitle != undefined) {
      if (this.newSongTitle.songTitle == undefined) {
        req.songTitle = this.newSongTitle;
      }
      else {
        req.songTitle = this.newSongTitle.songTitle;
      }
    }
    else {
      req.songTitle = "";
    }

    this.projectSub = this.projectSvc
      .newProject(req)
      .subscribe
      (
      r => {
        this.onSaveSuccess().then(_ => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      },
      e => this.onSaveError(e)
      );
  }

  onUpdateAddress() {
    if (this.model.city != this.updatedLocation) {
      this.clearAddressFields();
    }

    if (!this.model.city) {
      this.model.location = this.updatedLocation;
      this.model.city = this.model.location;
    }
  }

  protected onUpdate() {
    if (this.updatedLocation) {
      this.onUpdateAddress();
    }
    if (!this.model.city || !this.model.location) {
      this.disableUpdateSubmit = false;
      return;
    }
    var aa = this.model;

    this.isProjectEdit = false;
    const req = new EditProjectRequest();
    req.id = this.projectId;
    // req.projectName = this.model.projectName;
    req.budgetRange = this.model.budgetRange;
    req.crewRoles = this.model.crewRoles;
    req.projectType = this.model.projectType;
    req.releaseYear = this.model.releaseYear;
    req.productionCompany = this.model.productionCompany;
    req.city = this.model.city;
    req.state = this.model.state;
    req.stateCode = this.model.stateCode;
    req.country = this.model.country;
    req.countryCode = this.model.countryCode;
    req.latitude = this.model.latitude;
    req.longitude = this.model.longitude;
    req.url = this.model.url;
    req.seriesTitle = this.model.seriesTitle;
    req.artistTitle = this.model.artistTitle;

    if (this.newModeType != undefined) {
      if (this.newModeType.projectName == undefined) {
        req.projectName = this.newModeType;
      }
      else {
        req.projectName = this.newModeType.projectName;
      }
    }
    else {
      req.projectName = "";
    }

    if (this.newEpisodeTitle != undefined) {
      if (this.newEpisodeTitle.episodeTitle == undefined) {
        req.episodeTitle = this.newEpisodeTitle;
      }
      else {
        req.episodeTitle = this.newEpisodeTitle.episodeTitle;
      }
    }
    else {
      req.episodeTitle = "";
    }
    if (this.newSongTitle != undefined) {
      if (this.newSongTitle.songTitle == undefined) {
        req.songTitle = this.newSongTitle;
      }
      else {
        req.songTitle = this.newSongTitle.songTitle;
      }
    }
    else {
      req.songTitle = "";
    }


    this.projectSub = this.projectSvc
      .updateProject(req, this.projectId)
      .subscribe
      (
      r => {
        this.onSaveSuccess().then(_ => {

          setTimeout(() => {

            window.location.reload();
          }, 1500);
        });
      },
      e => this.onSaveError(e)
      );
  }

  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
      this.model = this.newModel();
      DialogHeader.SetProfileImageUrl(header);
      this.model.header = header;
      this.model.budgetRange = this.budgetRanges[0];
      this.showDialog();
    }, e => this.onLoadError());
  }

  private getCrewRoles() {
    this.crewSub = this.lookupSvc.getCrewRoles().subscribe(crewRoles => {
      this.allCrewRoles = crewRoles;
    }, e => this.onLoadError());
  }

  private getLocalDropdowns() {
    this.allProjectTypes = this.lookupSvc.getProjectTypes();
    this.budgetRanges = this.lookupSvc.getBudgetRanges();
  }

  private getSongTitles(title, type) {
    this.projectSvc.songTitles(title, type).subscribe(data => {
      this.songTitleSuggestions = data;
    }, e => this.onLoadError());
  }

  private projectsByTitle(title, type) {
    this.projectSvc.byProjectTitles(title, type).subscribe(data => {
      this.suggestions = data;
    }, e => this.onLoadError());
  }

  private getEpisodeTitles(title, type) {
    this.projectSvc.episodeTitles(title, type).subscribe(data => {
      this.episodeTitleSuggestions = data;
    }, e => this.onLoadError());
  }
}
