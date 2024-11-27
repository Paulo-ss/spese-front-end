import { Banks } from "@/enums/banks.enum";

export interface IBankAccountForm {
  bank?: Banks;
  currentBalance: number;
}

export interface IBankAccountFieldsArray {
  bankAccounts: IBankAccountForm[];
}

export interface IBankAccount {
  id: number;
  bank: Banks;
  currentBalance?: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
