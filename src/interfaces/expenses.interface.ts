import {
  ExpenseCategory,
  ExpenseStatus,
  ExpenseType,
} from "@/enums/expenses.enum";
import { IBankAccount } from "./bank-account.interface";
import { ICreditCard } from "./credit-card.interface";
import { ICategory } from "./category.interface";

export interface IExpense {
  id: number;
  userId: number;
  expenseType: ExpenseType;
  name: string;
  price: number;
  status: ExpenseStatus;
  expenseDate: string;
  updatedAt: Date;
  category?: ExpenseCategory;
  customCategory?: ICategory;
  bankAccount?: IBankAccount;
  creditCard?: ICreditCard;
  installmentNumber?: number;
  totalInstallments?: number;
}

export interface IExpensesFilters {
  month: string | null;
  fromDate: string | null;
  toDate: string | null;
  category?: ExpenseCategory | null;
  customCategory?: number | null;
  name?: string | null;
  priceRange?: number[] | null;
  status?: ExpenseStatus | null;
  creditCardId?: number | null;
}

export interface IExpenseForm {
  name?: string | null;
  price?: number | null;
  expenseDate?: Date | null;
  expenseType?: ExpenseType | null;
  bankAccountId?: number | null;
  creditCardId?: number | null;
  installments?: number | null;
  category?: ExpenseCategory | null;
  customCategory?: number | null;
}

export type ExpenseFormKeys = keyof IExpenseForm;

export type ExpenseGroup = { [key: string]: IExpense[] };
