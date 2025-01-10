import { IExpense } from "@/interfaces/expenses.interface";

const groupExpensesByCategory = (expenses: IExpense[]) => {
  return expenses.reduce((groupedExpenses, expense) => {
    const isCategoryAlreadyGrouped = Object.keys(groupedExpenses).some(
      (category) => {
        if (expense.customCategory) {
          return category === expense.customCategory.name;
        }

        return category === expense.category;
      }
    );

    if (isCategoryAlreadyGrouped) {
      groupedExpenses[
        expense.customCategory ? expense.customCategory.name : expense.category!
      ].push(expense);

      return groupedExpenses;
    }

    return {
      ...groupedExpenses,
      [expense.customCategory
        ? expense.customCategory.name
        : expense.category!]: [expense],
    };
  }, {} as { [key: string]: IExpense[] });
};

export default groupExpensesByCategory;
