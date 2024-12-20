import { ExpenseGroup, IExpense } from "@/interfaces/expenses.interface";
import groupExpensesByDate from "./groupExpensesByDate";

const limitExpenses = <T>(
  expenseGroup: ExpenseGroup,
  { limit, groupExpenses = false }: { limit?: number; groupExpenses?: boolean }
) => {
  const expenses: IExpense[] = [];

  for (const key in expenseGroup) {
    if (limit && expenses.length === limit) {
      break;
    }

    const groupedExpenses = expenseGroup[key];

    groupedExpenses.forEach((expense) => {
      if (limit && expenses.length === limit) {
        return;
      }

      expenses.push(expense);
    });
  }

  return (groupExpenses ? groupExpensesByDate(expenses) : expenses) as T;
};

export default limitExpenses;
