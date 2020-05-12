import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { HireProfileDialog, HireProfileRequest } from './models';
import { ISubscription } from 'rxjs/Subscription';

import { HireProfileDialogService } from './dialog.service';
import { DialogHeaderService } from '../header/dialog-header.service';
import { BaseDialogComponent } from '../BaseDialogComponent';

import { HireProfileService } from './hire-profile.service';
import { LookupService } from 'shared/services/lookup.service';
import { CrewRole } from 'shared/services/CrewRole';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { NotificationsService } from 'angular2-notifications';
import { masks } from 'shared/view/masks';
import { constants } from 'environments/constants';


import { QuickSearchItem } from '../../components/quick-search/QuickSearchItem';
import { QuickSearchService } from '../../components/quick-search/quick-search.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { environment } from "environments/environment";
import { SignalRConnection } from '@dharapvj/ngx-signalr';
import { ChatConfig } from 'chat/config';
import { ActivatedRoute } from '@angular/router';





@Component({
  selector: 'ij-hire-profile-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles.less'],
  providers: [HireProfileService]
})
export class HireProfileDialogComponent extends BaseDialogComponent<HireProfileDialog> implements OnDestroy {
  public rateMask = createNumberMask({ prefix: '' });
  public allCrewRoles: CrewRole[] = [];
  public crewRoleSuggestions: string[] = [];
  public allProjectTypes: string[] = [];
  public allSongTitles: any = [];
  public allEpisodeTitles: string[] = [];
  public projectTypeSuggestions: string[] = [];
  public songTitleSuggestions: any = [];
  public suggestions: any = [];
  public episodeTitleSuggestions: any = [];
  public projectName: any;
  private dialogSub: ISubscription;
  private hireSub: ISubscription;
  private headerSub: ISubscription;
  private crewSub: ISubscription;

  public states = [];
  private qs$ = new Subject<string>();
  private sub: ISubscription;
  public input: string = null;
  public projectType: string = "empty";
  public projectTitle: string = "empty";
  public projectId: number;
  public newModeType: any;
  public episodeTitle: string;
  public songTitle: string;
  public isAdd: boolean = true;
  protected get SaveMessage() {
    return "Your request has been sent.";
  }
  private connection: SignalRConnection;
  @ViewChild("f") autoform;
  constructor(
    el: ElementRef,
    private dialogSvc: HireProfileDialogService,
    private hireSvc: HireProfileService,
    private lookupSvc: LookupService,
    private headerSvc: DialogHeaderService,
    notificationSvc: NotificationsService,
    private route: ActivatedRoute
  ) {
    super(HireProfileDialog, el, notificationSvc);
    this.states = lookupSvc.getStates();

    this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
      this.connection = ChatConfig.BASE_CONNECTION || route.snapshot.data['connection'];
      this.resetForm(profileSysId);
      this.getLocalDropdowns();
      this.getCrewRoles();
      this.buildModel();
    });
  }


  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }

    if (this.hireSub) {
      this.hireSub.unsubscribe();
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

    }
  }

  selectProjectType(event) {
    this.projectType = event;
  }

  selectSongTitle(value: HireProfileDialog) {
    this.model.songTitle = value.songTitle;
    this.model.artistTitle = value.artistTitle;
    this.model.productionCompany = value.productionCompany;
    this.model.crewRoles = [];
  }

  onSongTitleKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.getSongTitles(query, this.model.projectType);
  }

  selectEpisodeTitle(value: HireProfileDialog) {
    this.model.episodeTitle = value.episodeTitle;
    this.model.seriesTitle = value.seriesTitle;
    this.model.productionCompany = value.productionCompany;
    this.model.crewRoles = [];
  }

  onEpisodeTitleKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();
    this.getEpisodeTitles(query, this.model.projectType);
  }


  onKeyDown(event) {
    let query = (event.query || event).toLocaleLowerCase();

    this.projectsByTitle(query, this.model.projectType);
  }

  onSelect(value: HireProfileDialog) {
    setTimeout(() => {
      if (this.model.projectType != "Web Series" && this.model.projectType != "Television Show" && this.model.projectType != "Music Video") {
        this.newModeType = value.newModeType;
        this.episodeTitle = undefined;
        this.songTitle = undefined;
      }

      if (this.model.projectType == "Web Series" || this.model.projectType == "Television Show") {
        this.newModeType = undefined;
        this.songTitle = undefined;
        this.episodeTitle = value.episodeTitle;
      }

      if (this.model.projectType == "Music Video") {
        this.newModeType = undefined;
        this.episodeTitle = undefined;
        this.songTitle = value.songTitle;

      }
    }, 500);

    this.model.projectType = value.projectType;
    this.model.projectName = value.projectName;
    this.model.productionCompany = value.productionCompany;
    this.model.rate = value.rate;
    this.model.rateType = value.rateType;
    this.model.city = value.city;
    this.model.state = value.state;
    this.model.message = value.message;
    this.model.dates = value.dates;
    this.model.crewRoles = [];
  }

  onKey(event) {

  }

  protected onClear() {
    this.projectType = "";
    this.model.projectType = "";
    this.model.projectName = "";
    this.projectTitle = "";


  }

  protected onSend() {

    const req = new HireProfileRequest();
    req.crewRoles = this.model.crewRoles;
    req.dates = this.model.dates;
    req.message = this.model.message;
    req.projectType = this.model.projectType;
    req.productionCompany = this.model.productionCompany;
    req.rate = this.model.rate;
    req.rateType = this.model.rateType;
    req.city = this.model.city;
    req.state = this.model.state;
    req.projectName = this.model.projectName;
    req.artistTitle = this.model.artistTitle;
    req.seriesTitle = this.model.seriesTitle;
    req.episodeTitle = this.model.episodeTitle;
    req.songTitle = this.model.songTitle;


    this.hireSub = this.hireSvc
      .hireProfile(this.profileSysId, req)
      .subscribe(
        result => {
          console.log(result);
          this.connection.invoke('SaveNotification', result).then((data: any) => {
          });
          this.onSaveSuccess();
        },
        e => this.onSaveError(e),
    );
  }



  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
      this.model = this.newModel();
      DialogHeader.SetProfileImageUrl(header);
      this.model.header = header;

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
  }

  private getSongTitles(title, type) {
    this.hireSvc.songTitles(title, type).subscribe(data => {
      this.songTitleSuggestions = data;
    }, e => this.onLoadError());
  }

  private projectsByTitle(title, type) {
    this.hireSvc.byProjectTitles(title, type).subscribe(data => {
      this.suggestions = data;
    }, e => this.onLoadError());
  }

  private getEpisodeTitles(title, type) {
    this.hireSvc.episodeTitles(title, type).subscribe(data => {
      this.episodeTitleSuggestions = data;
    }, e => this.onLoadError());
  }
}
