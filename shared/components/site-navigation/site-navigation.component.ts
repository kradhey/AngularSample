import { OnInit, Component, Input } from "@angular/core";
import { ChatDialogService } from "chat/components/dialog.service";
import { ProfileNotificationService } from "chat/services/profile-notfication.service";
import { Idle } from "@ng-idle/core";
import { ChatConfig } from "chat/config";
import { SignalRConService } from "chat/services/signalR.service";
import { AuthService } from "auth/auth.service";
import { SignalRConnection } from "@dharapvj/ngx-signalr";
import { UserNotification, NotificationForType, NotificationType, UserNotificationResult, SignalRUserNotification } from "shared/components/site-menu/models";
import { ISubscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";
import { HireProfileDialogService } from "shared/dialogs/hire/dialog.service";
import { HireRequestProfileDialogService } from "shared/dialogs/hire-request/dialog.service";
import { SignalRConnectionService } from "chat/services/signalR.connection.service";
import { environment } from "environments/environment";
import { ChatService } from "chat/components/chat.service";
import { Data, ChatWindow } from "chat/components/models";

@Component({
    selector: 'ij-site-navigation',
    templateUrl: 'site-navigation.component.html',
    styleUrls: ['./style.less']
})
export class SiteNavigationComponent implements OnInit {
    // notifications
    private _connection: SignalRConnection;
    public messageNoticationCount: number = 0;
    public loadingNotifications: boolean;
    public loadingMessages: boolean;
    public userNotificationCount: number = 0;
    private pageNo = 1;
    private itemsPerPage = 5;
    public userNotificationMasterList: UserNotification[] = [];
    public userNotifications: UserNotification[] = [];
    private notificationSub: ISubscription;
    private messageSub: ISubscription;
    public newUserNotifications: boolean;
    public newMessageNotifications: boolean;
    public messageNotications: any = [];
    private messagePageNo = 1;
    userOfflineSub: ISubscription;
    userOnlineSub: ISubscription;
    @Input("menuWhiteColor") menuWhiteColor: boolean;
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
        private authSvc: AuthService,
        private chatDlg: ChatDialogService,
        private notificationSvc: ProfileNotificationService,
        private idle: Idle,
        private route: ActivatedRoute,
        private router: Router,
        private hireRequestDlg: HireRequestProfileDialogService,
        private signalRConnectionSvc: SignalRConnectionService,
        private chatSvc: ChatService,

    ) {
        console.log('site navigation component called');
        this.signalRConnectionSvc.connection.subscribe((con: SignalRConnection) => {
            this._connection = con;
            // ChatConfig.My_ConnectionId = this._connection.id;
            // ChatConfig.BASE_CONNECTION = this._connection;
            this.startConnection();
            // this.signalRConSvc.registerServerEvents();
            ////////////

            // this.getUserNotificationCount();
            // this.getMessageNotificationCount();
        })

        this.signalRConnectionSvc.connect();

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

        if (this.isLoggedIn) {
            this.getUserNotificationCount();
            this.getMessageNotificationCount();
        }

        this.userOnlineSub = this.chatDlg.userOnline$.subscribe(userId => {
            this.messageNotications.forEach(element => {
                if (element.fromProfileSysId == userId) {
                    element.isOnline = true;
                }
            });
        });

        this.userOfflineSub = this.chatDlg.userOffline$.subscribe(userId => {
            this.messageNotications.forEach(element => {
                if (element.fromProfileSysId == userId) {
                    element.isOnline = false;
                }
            });
        });
    }


    onHire(id: string) {
        this.hireRequestDlg.showDialog(id);
    }

    ngOnInit(): void {
        //////////
        // this.initChat();
        this.loadingNotifications = true;
        this.loadingMessages = true;
        this.notificationSub = this.notificationSvc.getUserNotifications(this.pageNo).subscribe(
            (result: UserNotificationResult) => {
                // Read Notifications for referral
                this.userNotificationMasterList = this.readAllNotifications(result.notifications);
                this.userNotifications = this.userNotificationMasterList.slice(0, (this.itemsPerPage * this.pageNo));
                this.loadingNotifications = false;
            });

        this.messageSub = this.notificationSvc.getMessageNotifications(this.messagePageNo).subscribe(
            (result: UserNotificationResult) => {
                this.loadingMessages = false;
                this.messageNotications = result.notifications;

                setTimeout(() => {
                    if (!this._connection) {
                        this._connection = ChatConfig.BASE_CONNECTION;
                    }
                    this.messageNotications.forEach(element => {
                        this._connection.invoke('UserOnline', element.fromProfileSysId);
                    });
                }, 1000);

            }
        );

    }

    showMessagesNotifications() {

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

    getMessageNotifications() {
        this.loadingMessages = true;
        this.messagePageNo++;
        this.notificationSvc.getMessageNotifications(this.messagePageNo).subscribe(
            result => {
                this.messageNotications = this.messageNotications.concat(result.notifications);
                this.loadingMessages = false;
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

    readMessageNotifications() {
        if (this.newMessageNotifications) {
            this.notificationSvc.readMessageNotifications().subscribe(
                result => {
                    this.newMessageNotifications = false;
                });
        }
    }

    // notifications
    openMessenger(message): void {
        message.isRead = true;
        this.messageNoticationCount--;
        this.chatSvc.showChatWindow(message.notificationId).subscribe(
            result => {
                if (!this._connection) {
                    this._connection = ChatConfig.BASE_CONNECTION;
                }
                this._connection.invoke('Contact', result.toProfileSysId, result.senderProfileSysId, null);
                // this.chatDlg.showToChatDialog(new Data<ChatWindow>(result));
            });
    }

    getProfileImageUrl(imgName: string) {
        if (imgName) {
            return environment.site.imageUrl(imgName);
        }
        else {
            return '../assets/images/avatars/avatar-lg.png';
        }
    }

    private startConnection() {
        console.log
            (
            ChatConfig.ConnectionExists
                ? "chat connection exists"
                : "chat connection does not exists"
            );
        let signalRSvc = new SignalRConService(this._connection, this.chatDlg, this.notificationSvc, this.idle);
        signalRSvc.startConnection();
        signalRSvc.registerServerEvents();
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

    private getMessageNotificationCount() {
        this.notificationSvc.getMessageNotificationCount().subscribe(
            result => {
                if (result > 0) {
                    this.messageNoticationCount = result;
                    if (this.messageNoticationCount > 0) {
                        this.newMessageNotifications = true;
                    }
                }
            });
    }
}