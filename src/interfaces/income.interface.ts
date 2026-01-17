import { IBankAccount } from "./bank-account.interface";

export interface IIncome {
  id: number;
  name: string;
  value: number;
  bankAccount?: IBankAccount;
  userId: number;
  incomeMonth: string;
  updatedAt: Date;
}

export interface IIncomeForm {
  name: string;
  value: number;
  date: Date;
  bankAccountId?: number;
}
