import { InvoiceStatus } from "@/enums/invoice.enum";
import { ICreditCard } from "./credit-card.interface";
import { IExpense } from "./expenses.interface";

export interface IInvoice {
  id: number;
  currentPrice: number;
  totalPrice: number;
  creditCard?: ICreditCard;
  closingDate: string;
  dueDate: string;
  status: InvoiceStatus;
  expenses: IExpense[];
  createdAt: string;
  updatedAt: string;
}
