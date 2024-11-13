import { Banks } from "@/enums/banks.enum";

export interface ICreditCard {
  nickname: string;
  bank: Banks;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface ICreditCardsForm {
  creditCards: ICreditCard[];
}
