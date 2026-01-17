import { CalendarEventType } from "@/enums/calendar-event-type.enum";
import { Event } from "react-big-calendar";

export interface ICashFlowDaily {
  id: number;
  openingBalance: number;
  closingBalance: number;
  date: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICashFlowTransaction extends Event {
  entityId: number;
  type: CalendarEventType;
  price: number;
  title: string;
  start: Date;
  end: Date;
}

export type TDailyCashFlow = {
  [key: string]: {
    transactions: ICashFlowTransaction[];
    openingBalance?: number;
    closingBalance?: number;
  };
};

export interface ICashFlowResponse {
  currentAccountsBalance?: number;
  dailyCashFlow: TDailyCashFlow;
}
