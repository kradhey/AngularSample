import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePage, Reviewer, ProjectCard, ReviewStatusTypes } from './models';
import { environment } from 'environments/environment';
import { Budget } from 'shared/services/budget';
import { ISubscription } from 'rxjs/Subscription';
import { NotificationsService } from 'angular2-notifications';

export class BaseProfileComponent implements OnInit, OnDestroy {
    model: ProfilePage;

    private routerSub: ISubscription;
    private routeSub: ISubscription;

    reviewStatusTypes = ReviewStatusTypes;

    get hasImdb() {
        if (this.model.imdbUrl) {
            return true;
        }

        return false;
    }

    get hasProjects() {
        return this.model.projects != null
            && this.model.projects.cards != null
            && this.model.projects.cards.length > 0;
    }

    get hasReviews() {
        return this.model.reviews != null
            && this.model.reviews.cards != null
            && this.model.reviews.cards.length > 0;
    }

    get hasResume() {
        if (this.model.resumeFileName && this.model.showResume) {
            return true;
        }

        return false;
    }

    get hasGear() {
        if (this.model.gearFileName && this.model.showGear) {
            return true;
        }

        return false;
    }

    protected saveMessage: string = 'Your changes have been saved.';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notificationSvc?: NotificationsService
    ) {
        this.routerSub = this.router.events.subscribe(
            () => window.scrollTo(0, 0)
        );
    }

    ngOnInit() {
        this.routeSub = this.route.data.subscribe((data: { profile: ProfilePage }) => {
            this.model = data.profile;
            this.onProfileChanged();
        });
    }

    ngOnDestroy() {
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }

        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }

    onProfileChanged() {
        this.setUnionData();
    }

    getProfileImageUrl() {
        if (this.model.profileImageUrl) {
            return environment.site.imageUrl(this.model.profileImageUrl);
        }
        else {
            return '../assets/images/avatars/avatar-lg.png';
        }
    }

    getImageUrl(imageUrl: string) {
        if (imageUrl) {
            return environment.site.imageUrl(imageUrl);
        }
        else {
            return '../assets/images/avatars/avatar-lg.png';
        }
    }

    protected openExternalWindow(url) {
        const win: any = window.open();
        win.opener = null;
        win.location = url;
    }

    protected getYouTubeImage(id) {
        return environment.site.video.youTubeThumbnail(id);
    }

    protected getYouTubeVideo(id) {
        return environment.site.video.youTubeVideo(id);
    }

    protected getVimeoVideo(id) {
        return environment.site.video.vimeoVideo(id);
    }

    protected getPdfViewerUrl(url) {
        return environment.site.pdfViewerUrl(url);
    }
    protected onSaveSuccess(): Promise<void> {
        if (this.notificationSvc) {
            this.notificationSvc.success("Success", this.saveMessage);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1);
        });
    }

    private setUnionData() {
        if (this.model.profileSysId.startsWith("freelancer")) {
            if (this.model.unionTypeId && this.model.unionTypeId > 1) {
                this.model.unionImgSrc = '../assets/images/union.png';
            } else {
                this.model.unionImgSrc = '../assets/images/non-union.png';

                if (!this.model.unionTypeId) {
                    this.model.unionTypeName = 'Non-Union';
                }
            }
        } else {
            if (this.model.speciality) {
                this.model.specialityImgSrc = '../assets/images/PostProductionIcon.png';
            } else {
                this.model.unionImgSrc = '../assets/images/PostProductionIcon.png';

                if (!this.model.speciality) {
                    this.model.specialityImgSrc = '../assets/images/PostProductionIcon.png';
                }
            }
        }
    }
}