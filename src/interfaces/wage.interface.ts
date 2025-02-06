import { WageBusinessDay } from "@/enums/wage.enum";
import { IBankAccount } from "./bank-account.interface";

export interface IWageForm {
  wage: number;
  paymentDay: number;
  businessDay: WageBusinessDay;
  bankAccountId?: number;
}

export interface IWagesForm {
  wages: IWageForm[];
}

export interface IWage {
  id: number;
  wage: number;
  paymentDay: number;
  businessDay: WageBusinessDay;
  bankAccount?: IBankAccount;
  userId: number;
}
