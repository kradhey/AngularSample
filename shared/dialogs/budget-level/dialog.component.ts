import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { BudgetLevelDialog, BudgetDetails, ReviewDetails } from './models';
import { ISubscription } from 'rxjs/Subscription';

import { BudgetLevelDialogService } from './dialog.service';
import { DialogHeaderService } from '../header/dialog-header.service';
import { BaseDialogComponent } from '../BaseDialogComponent';

import { BudgetLevelService } from './budget-level.service';
import { LookupService } from 'shared/services/lookup.service';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { environment } from "environments/environment";
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'auth/auth.service';
import { BudgetStatusTypes, Budgets } from 'shared/services/Budget';
import { BudgetLevels } from 'shared/services/BudgetLevels';
@Component({
  selector: 'ij-budget-level-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles.less'],
  providers: [BudgetLevelService]
})
export class BudgetLevelDialogComponent extends BaseDialogComponent<BudgetLevelDialog> implements OnDestroy {
  private dialogSub: ISubscription;
  private headerSub: ISubscription;
  public dialogTitle: string;
  public BudgetLevel: string;
  public visibleDialog: boolean = true;
  public budgetLevels = [];
  public budgetStatusTypes = BudgetStatusTypes;
  public budgetLevel = Budgets;

  @ViewChild("f") autoform;
  constructor(
    el: ElementRef,
    private dialogSvc: BudgetLevelDialogService,
    private budgetSvc: BudgetLevelService,
    private lookupSvc: LookupService,
    private headerSvc: DialogHeaderService,
    private authSvc: AuthService,
    notificationSvc: NotificationsService
  ) {
    super(BudgetLevelDialog, el, notificationSvc);
    this.dialogSub = this.dialogSvc.showDialog$.subscribe(profileSysId => {
      this.setBudgetLevels();
      this.resetForm(profileSysId);
      this.buildModel();
    });

  }


  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }

    if (this.headerSub) {
      this.headerSub.unsubscribe();
    }
  }
  private buildModel() {
    this.headerSub = this.headerSvc.getData(this.profileSysId).subscribe(header => {
      if (header.budgetNotification) {
        this.model = this.newModel();
        DialogHeader.SetProfileImageUrl(header);
        this.model.header = header;
        this.model.budgetLevel = new BudgetLevels(this.model.header.reviewCount,this.model.header.projectCount, this.model.header.biography);
        this.setTitle(this.model.header.budgetStatus);
        this.showDialog();
        this.updateBudgetNotification();
      }
    }, e => this.onLoadError());
  }


  setTitle(budgetStatus: BudgetStatusTypes) {
    switch (budgetStatus) {
      case BudgetStatusTypes.Upgraded:
        this.dialogTitle = 'Congratulations';
        break;
      case BudgetStatusTypes.Downgraded:
        this.dialogTitle = 'NOTICE';
        break;
    }
  }

  close() {
    this.hideDialog();
  }


  private updateBudgetNotification() {
    this.budgetSvc.updateBudgetNotification().subscribe(reviewsDetails => {
    });
  }

  private setBudgetLevels() {
    for (let g of this.lookupSvc.getBudgetLevels()) {
      this.budgetLevels.push({ name: g, value: g });
    }
  }

}
