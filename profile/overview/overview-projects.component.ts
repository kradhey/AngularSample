import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { ProfilePage, PagerResponse, DefaultPageSize, CardResponse, ProjectCardResponse, PagerRequest, ProjectCard } from '../models';
import { BaseProfileComponent } from '../BaseProfileComponent';
import { ProjectDialogService } from 'shared/dialogs/project/dialog.service';
import { ProfileService } from 'profile/profile.service';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/first';
import { environment } from "environments/environment";

@Component({
    selector: 'ij-profile-overview-projects',
    templateUrl: 'overview-projects.component.html',
    styleUrls: ['./styles/projects.less'],
    providers: [ConfirmationService]
})
export class ProfileOverviewProjectsComponent extends BaseProfileComponent implements OnInit, OnDestroy {
    hasMoreProjects: boolean = false;
    confirmAcceptLabel = "Yes";
    private lastProjectReq: PagerRequest;
    constructor (
      route: ActivatedRoute,
      router: Router,
      private dialogSvc: ProjectDialogService,
      private profileSvc: ProfileService,
      private confirmSvc: ConfirmationService
    ) {
        super(route, router);
    }

    getFavoriteLabel(project: ProjectCardResponse) {
        if (project && project.isFavorite) {
          return "Remove from Favorites";
        }

        return "Add to Favorites";
    }

    isFavorite(project: ProjectCardResponse) {
        return project && project.isFavorite;
    }

    onProfileChanged() {
      super.onProfileChanged();

      if (this.model.projects && this.model.projects.pager) {
        this.hasMoreProjects = this.model.projects.pager.hasMore;
      }
    }

    trackCard(card: ProjectCardResponse) {
      return card == null ? null : card.id;
    }

    onNewProject() {
      this.dialogSvc.newProject(this.model.profileSysId);
    }

    onEditProject(project: ProjectCardResponse) {
      this.dialogSvc.editProject(this.model.profileSysId, project.id);
    }

    onToggleFavorite(project: ProjectCardResponse) {
        if (project.isFavorite) {
            this.profileSvc
                .removeFromFavorite(project.id)
                .first()
                .subscribe(p => {
                    project.isFavorite = false;
                });
        }
        else {
            this.profileSvc
                .addToFavorite(project.id)
                .first()
                .subscribe(p => {
                    project.isFavorite = true;
                }, e => {
                    this.confirmAcceptLabel = "OK";
                    this.confirmSvc.confirm({
                      message: "You can only have 3 favorite projects. Please unfavorite one, first.",
                      header: "Add to Favorites",
                      rejectVisible: false,
                    });
                });
        }
    }

    onDeleteProject(project: ProjectCardResponse) {
        this.confirmAcceptLabel = null;
        let message = null;
        let rejectVisible = false;

        if (project.hasReviews) {
            message = "You cannot delete a project that already has reviews. Please use the 'Report' feature for further assistance.";
            this.confirmAcceptLabel = "Ok";
            rejectVisible = false;
        }
        else {
            message = "Are you sure you want to delete this project?";
            this.confirmAcceptLabel = "Yes";
            rejectVisible = true;
        }

        this.confirmSvc.confirm({
          message,
          header: "Delete Project",
          rejectVisible,
          accept: () => {
            if (!project.hasReviews) {
              this.profileSvc.deleteProject(project.id).first().subscribe(r => {
                this.deleteProject(project);
              }, r => {
                this.onDeleteError(r);
              });
            }
          }
        });
    }

    onViewMoreClicked() {
        if (this.lastProjectReq == null) {
          this.lastProjectReq = new PagerRequest();
          this.lastProjectReq.page = 1;
          this.lastProjectReq.pageSize = DefaultPageSize;
        }

        let request = Object.assign({}, this.lastProjectReq);
        request.page++;

        this.getProjects(this.model.profileSysId, request);
    }

    private getProjects(profileSysId: string, request: PagerRequest) {
        this.profileSvc
          .getProjects(profileSysId, request)
          .first()
          .subscribe
          (
            r => this.onGetSuccessful(r),
            e => this.onGetError(e)
          );
    }

    private onGetSuccessful(res: CardResponse<ProjectCardResponse>) {
        this.lastProjectReq.page = res.pager.current;
        this.hasMoreProjects = res.pager.hasMore;

        if (res.cards && res.cards.length > 0) {
          for (let r of res.cards) {
            ProjectCard.Initialize(r);
          }
        }

        this.model.projects.cards.push(...res.cards);
    }

    private deleteProject(project: ProjectCardResponse) {
        const index = this.model.projects.cards.indexOf(project);
        this.model.projects.cards.splice(index, 1);
        this.model.projects.pager.totalResults--;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
    }

    private onGetError(e) {}
    private onDeleteError(e) {}
}