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
  fromMonth: string;
  toMonth?: string;
  category?: ExpenseCategory;
  customCategory?: number;
  name?: string;
  priceRange?: number[];
  status?: ExpenseStatus;
  creditCardId?: number;
  userId: number;
}

export type ExpenseGroup = { [key: string]: IExpense[] };
