import { IExpense } from "@/interfaces/expenses.interface";

const groupExpensesByDate = (expenses: IExpense[]) => {
  return expenses.reduce((groupedExpenses, expense) => {
    const isDateAlreadyGrouped = Object.keys(groupedExpenses).some(
      (expenseDate) => expenseDate === expense.expenseDate
    );

    if (isDateAlreadyGrouped) {
      groupedExpenses[expense.expenseDate].push(expense);
      return groupedExpenses;
    }

    return { ...groupedExpenses, [expense.expenseDate]: [expense] };
  }, {} as { [key: string]: IExpense[] });
};

export default groupExpensesByDate;
