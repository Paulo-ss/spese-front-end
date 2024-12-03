import { Banks } from "@/enums/banks.enum";

export interface ICreditCard {
  id: number;
  nickname: string;
  bank: Banks;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface ICreditCardsForm {
  creditCards: ICreditCard[];
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
