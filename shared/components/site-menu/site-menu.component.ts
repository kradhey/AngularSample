import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { LookupService } from 'shared/services/lookup.service';
import { AuthService } from 'auth/auth.service';
import { HireRequestProfileDialogService } from 'shared/dialogs/hire-request/dialog.service';
import { HireProfileDialogService } from 'shared/dialogs/hire/dialog.service'
import { environment } from 'environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { ChatConfig } from 'chat/config';
import { SignalRConnection } from '@dharapvj/ngx-signalr';
import { SignalRConService } from 'chat/services/signalR.service';
import { ChatDialogService } from 'chat/components/dialog.service';
import { Idle } from '@ng-idle/core';
import { ProfileNotificationService } from 'chat/services/profile-notfication.service';
import { UserNotification, NotificationType, NotificationForType, SignalRUserNotification, UserNotificationResult } from './models';
import { SignalRConnectionService } from 'chat/services/signalR.connection.service';

@Component({
    selector: 'ij-site-menu',
    templateUrl: 'site-menu.component.html',
    styleUrls: ['./style.less'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 }))
            ])
        ])]
})
export class SiteMenuComponent implements OnInit, OnDestroy {
    // notifications
    private _connection: SignalRConnection;
    public messageNoticationCount: number = 0;
    public loadingNotifications: boolean;
    public userNotificationCount: number = 0;
    private pageNo = 1;
    private itemsPerPage = 5;
    public userNotificationMasterList: UserNotification[] = [];
    public userNotifications: UserNotification[] = [];
    private notificationSub: ISubscription;
    public newUserNotifications: boolean;
    @Output() quickSearchEvent = new EventEmitter<string>();
    @Input("menuWhiteColor") menuWhiteColor : boolean;
    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    get profileSysId() {
        return this.authSvc.profileSysId;
    }

    get isSiteHeader() {
        return this.menuWhiteColor ? true : false;
    }

    constructor(
        private lookupSvc: LookupService,
        private authSvc: AuthService,
        private router: Router,
        private hireRequestDlg: HireRequestProfileDialogService,
        private route: ActivatedRoute,
        private hireProfileDlg: HireProfileDialogService,
        private meta: Meta,
        private title: Title,
        private chatDlg: ChatDialogService,
        private notificationSvc: ProfileNotificationService,
        private idle: Idle
    ) {
        this.notificationSvc.showNotification$.subscribe((data: SignalRUserNotification) => {
            // Read Notifications for referral
            if (data.data.notificationType == NotificationType.Hire) {
                this.userNotificationMasterList.splice(0, 0, data.data);
                this.userNotifications.splice(0, 0, data.data);
                this.userNotificationCount++;
            }
            else if (data.data.notificationType == NotificationType.ReferralRecipient) {
                this.userNotificationMasterList.splice(0, 0, data.data);
                this.userNotifications.splice(0, 0, data.data);
                this.userNotificationCount++;
            }
            else if (data.data.notificationType == NotificationType.Referral) {
                let referralNotifications = this.readNotification(data.data);
                for (let i = 0; i < referralNotifications.length; i++) {
                    this.userNotificationMasterList.splice(i, 0, referralNotifications[i]);
                    this.userNotifications.splice(i, 0, referralNotifications[i]);
                }
                this.userNotificationCount = this.userNotificationCount + referralNotifications.length;
            }
            this.newUserNotifications = true;
        });
    }

    ngOnInit() {
        //////////
        // this.initChat();
        // ////////////

        // this.getUserNotificationCount();

        // this.loadingNotifications = true;
        // this.notificationSub = this.notificationSvc.getUserNotifications(this.pageNo).subscribe(
        //     (result: UserNotificationResult) => {
        //         // Read Notifications for referral
        //         this.userNotificationMasterList = this.readAllNotifications(result.notifications);
        //         this.userNotifications = this.userNotificationMasterList.slice(0, (this.itemsPerPage * this.pageNo));
        //         this.loadingNotifications = false;
        //     });
    }

    ngOnDestroy() {
    }

    onToggleQuickSearch() {
        this.quickSearchEvent.next();
    }

    onHire(id: string) {
        this.hireRequestDlg.showDialog(id);
    }


    showMyNotifications() {

    }

    //// Chat Initialization
    private initChat() {
        // console.log
        //     (
        //     ChatConfig.My_ConnectionId == undefined || ChatConfig.My_ConnectionId == ""
        //         ? "chat connection exists"
        //         : "chat connection does not exists"
        //     );

        // if (ChatConfig.My_ConnectionId == undefined || ChatConfig.My_ConnectionId == "") {
        //     this._connection = this.route.snapshot.data['connection'];
        //     new SignalRConService(this._connection, false, this.chatDlg, this.notificationSvc, this.idle);
        // }
        // else {
        //     this._connection = ChatConfig.BASE_CONNECTION;
        //     new SignalRConService(this._connection, true, this.chatDlg, this.notificationSvc, this.idle);
        // }
    }


    getUserNotifications() {
        this.loadingNotifications = true;
        this.pageNo++;
        this.notificationSvc.getUserNotifications(this.pageNo).subscribe(
            result => {
                let notifications = this.userNotificationMasterList.concat(result.notifications);
                notifications = this.removeDuplicates(notifications, "id");
                this.userNotificationMasterList = this.readAllNotifications(notifications);
                this.userNotifications = this.userNotificationMasterList.slice(0, (this.itemsPerPage * this.pageNo));
                this.loadingNotifications = false;
            });
    }


    readUserNotifications() {
        if (this.newUserNotifications) {
            this.notificationSvc.readUserNotifications().subscribe(
                result => {
                    this.newUserNotifications = false;
                });
        }
    }

    private removeDuplicates(myArr: any[], prop) {
        return myArr.filter((obj, pos, arr) => {
            if (!obj.id) return true;
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    private readAllNotifications(notifications: UserNotification[]) {
        for (let index = 0; index < notifications.length; index++) {
            const element = notifications[index];
            if (element.notificationType == NotificationType.Referral) {
                let referralNotifications = this.readNotification(element);
                notifications.splice(index, 1);
                for (let i = 0; i < referralNotifications.length; i++) {
                    notifications.splice(index + i, 0, referralNotifications[i]);
                }
            }
        }
        return notifications;
    }

    private readNotification(notification: UserNotification): UserNotification[] {
        let result: UserNotification[] = [];
        if (notification.notificationFor == NotificationForType.Sender) {
            notification.referralSenderMessages.forEach(message => {
                let newNotification = new UserNotification();
                newNotification.message = message;
                newNotification.isRead = notification.isRead;
                newNotification.createdDate = notification.createdDate;
                result.push(newNotification);
            });
        }
        else if (notification.notificationFor == NotificationForType.Receiver) {
            notification.referredMessages.forEach(message => {
                let newNotification = new UserNotification();
                newNotification.message = message;
                newNotification.isRead = notification.isRead;
                newNotification.createdDate = notification.createdDate;
                result.push(newNotification);
            });
        }
        return result;
    }

    private getUserNotificationCount() {
        this.notificationSvc.getUserNotificationCount().subscribe(
            result => {
                if (result > 0) {
                    this.userNotificationCount = result;
                    if (this.userNotificationCount > 0)
                        this.newUserNotifications = true;
                }
            });
    }

}