import { Banks } from "@/enums/banks.enum";

export interface IBankAccountForm {
  bank?: Banks;
  currentBalance: number;
}

export interface IBankAccountFieldsArray {
  bankAccounts: IBankAccountForm[];
}
