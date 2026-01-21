import { IExpense, IExpensesFilters } from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";
import Expenses from "../client/Expenses";
import { getLanguage } from "@/app/actions/cookies/getLanguague";
import groupExpensesByCategory from "@/utils/expenses/groupExpensesByCategory";
import {
  formatDate,
  formatForLocale,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getToday,
} from "@/utils/dates/dateUtils";

interface IProps {
  limit?: number;
  displayFilters?: boolean;
  isExpensesPage?: boolean;
}

export default async function ExpensesServer({
  limit,
  displayFilters,
  isExpensesPage,
}: IProps) {
  const locale = await getLanguage();

  const today = getToday();
  const firstDayOfTheMonth = getFirstDayOfMonth(today);
  const lastDayOfTheMonth = getLastDayOfMonth(today);

  const selectedDate = isExpensesPage ? firstDayOfTheMonth : today;

  const selectedMonth = formatDate(
    selectedDate,
    isExpensesPage ? "YYYY-MM-DD" : "YYYY-MM",
  );
  const selectedToMonth = isExpensesPage
    ? formatDate(lastDayOfTheMonth, "YYYY-MM-DD")
    : undefined;

  const body: IExpensesFilters = {
    month: !isExpensesPage ? selectedMonth : null,
    fromDate: isExpensesPage ? selectedMonth : null,
    toDate: isExpensesPage ? selectedToMonth! : null,
  };

  const { data: expenses, error } = await fetchResource<IExpense[]>({
    url: "/expense/filter",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(body),
      },
    },
  });

  if (expenses) {
    for (const expense of expenses) {
      expense.expenseDate = formatForLocale({
        date: expense.expenseDate,
        locale,
      });
    }
  }

  return (
    <Expenses
      locale={locale}
      initialExpenses={
        expenses ? groupExpensesByCategory(expenses!) : undefined
      }
      error={error}
      limit={limit}
      displayFilters={displayFilters}
    />
  );
}
