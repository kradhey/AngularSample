export class SignalRUserNotification{
    public data: UserNotification;
    public connection: any
  }

  export class UserNotificationResult{
    public count: number;
    public notifications: UserNotification[]
  }
  
  export class UserNotification {
    public id: number;
    public createdDate: string;
    public isRead: boolean;
    public notificationType: NotificationType;
    public message: string;
    public senderProfileSysId: string;
    public referredProfileSysId: string;
    public referralSenderMessages: string[];
    public referredMessages: string[];
    public notificationFor: NotificationForType;
  }
  
  export enum NotificationType {
    Referral = 1,
    Hire = 2,
    ReferralRecipient = 3
  }
  
  export enum NotificationForType {
    Sender = 1,
    Receiver = 2,
    Recipient = 3
  }