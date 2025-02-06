import { Banks } from "@/enums/banks.enum";
import { ISubscription } from "./subscription.interface";
import { IInvoice } from "./invoice.interface";
import { IBankAccount } from "./bank-account.interface";

export interface ICreditCard {
  id: number;
  nickname: string;
  bank: Banks;
  limit: number;
  lastFourDigits: string;
  closingDay: number;
  bankAccount?: IBankAccount;
  dueDay: number;
  invoices?: IInvoice[];
  subscriptions?: ISubscription[];
}

export interface ICreditCardForm {
  id: number;
  nickname: string;
  bank: Banks;
  limit: number;
  lastFourDigits: string;
  closingDay: number;
  dueDay: number;
  bankAccountId?: number | null;
}

export interface ICreditCardsForm {
  creditCards: ICreditCardForm[];
}

export interface ICreditCardSummary {
  id: number;
  nickname: string;
  currentMonthInvoiceTotal: number;
  otherMonthsTotal: number;
  lastFourDigits: string;
  closedTotal: number;
  bank: Banks;
  closingDate: string;
  dueDate: string;
  limit: number;
}
