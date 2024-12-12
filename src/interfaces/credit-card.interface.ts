import { Banks } from "@/enums/banks.enum";
import { ISubscription } from "./subscription.interface";
import { IInvoice } from "./invoice.interface";

export interface ICreditCard {
  id: number;
  nickname: string;
  bank: Banks;
  limit: number;
  closingDay: number;
  dueDay: number;
  invoices?: IInvoice[];
  subscriptions?: ISubscription[];
}

export interface ICreditCardForm {
  id: number;
  nickname: string;
  bank: Banks;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface ICreditCardsForm {
  creditCards: ICreditCardForm[];
}

export interface ICreditCardSummary {
  id: number;
  nickname: string;
  currentMonthInvoiceTotal: number;
  otherMonthsTotal: number;
  closedTotal: number;
  bank: Banks;
  closingDate: string;
  dueDate: string;
  limit: number;
}
