import { IBankAccount } from "./bank-account.interface";
import { IWage } from "./wage.interface";

export interface IIncome {
  id: number;
  name: string;
  value: number;
  bankAccount?: IBankAccount;
  wage?: IWage;
  userId: number;
  incomeMonth: string;
  updatedAt: Date;
}

export interface IIncomeForm {
  name: string;
  value: number;
  date: Date;
  bankAccountId?: number;
  wageId?: number;
}
