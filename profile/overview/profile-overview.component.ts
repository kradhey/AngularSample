import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { BudgetLevelService } from './../../shared/dialogs/budget-level/budget-level.service';
import { BudgetLevelDialog, BudgetDetails } from './../../shared/dialogs/budget-level/models'
import { Budgets } from 'shared/services/Budget';

@Component({
    selector: 'ij-profile-overview',
    templateUrl: './profile-overview.component.html',
    styleUrls: ['./styles/common.less'],
    providers: [BudgetLevelService]
})
export class ProfileOverviewComponent extends BaseProfileComponent {
    notificationMessage = null;
    showNotificationMessage = false;
    public projectModel: BudgetDetails;

    constructor(
        route: ActivatedRoute,
        router: Router,
        private budgetSvc: BudgetLevelService
    ) {
        super(route, router);


    }

    onProfileChanged() {
        this.setupNotificationMessage();
    }

    setupNotificationMessage() {
        const minProjectItems = 2;
        const minReviewItems = 1;
        const isStudentBudget = this.model.defaultBudget == Budgets.StudentBudget;
        if (!this.model || !this.model.isOwnProfile || isStudentBudget || !this.model.projects.pager || !this.model.reviews.pager || 
            this.model.projects.pager.totalResults >= 2 && this.model.biography && this.model.reviews.pager.totalResults >= 1) {
            this.showNotificationMessage = false;
            return;
        }

        const needProjects = this.model.projects.pager.totalResults < minProjectItems;
        const needReviews = this.model.reviews.pager.totalResults < minReviewItems;
        const needBio = !this.model.biography;
        const incomplete = needProjects || needReviews || needBio;

        this.showNotificationMessage = incomplete;

        if (!incomplete) {
            return;
        }

        let msg = "In order to bring your profile public, you must ";
        let projects = null;
        let reviews = null;

        if (needBio) {
            msg += "enter a biography";
        }

        if (!needProjects && !needReviews) {
            msg += ".";
        }
        else {
            msg += needBio ? ", " : " ";
        }

        if (needProjects) {
            projects = `${minProjectItems - this.model.projects.pager.totalResults} more project(s)`;
        }

        if (needReviews) {
            reviews = `${minReviewItems - this.model.reviews.pager.totalResults} more review(s)`;
        }

        if (projects && reviews) {
            msg += `add ${projects} and ${reviews}.`;
        }
        else {
            if (projects) {
                msg += `add ${projects}.`;
            }

            if (reviews) {
                msg += `have ${reviews}.`
            }
        }

        this.notificationMessage = msg;
    }
}