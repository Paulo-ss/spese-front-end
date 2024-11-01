import { INotification } from "./notifications.interface";

export interface ISSENotification {
  unreadCount: number;
  notification?: INotification;
}
