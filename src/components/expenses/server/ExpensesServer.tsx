import { IExpense, IExpensesFilters } from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";
import Expenses from "../client/Expenses";
import { getLanguage } from "@/app/actions/cookies/getLanguague";
import groupExpensesByCategory from "@/utils/expenses/groupExpensesByCategory";

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

  const today = new Date();
  const firstDayOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfTheMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  const selectedDate = isExpensesPage ? firstDayOfTheMonth : today;

  const selectedMonth = selectedDate
    .toLocaleDateString("en", {
      day: isExpensesPage ? "2-digit" : undefined,
      month: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", "-");
  const selectedToMonth = isExpensesPage
    ? lastDayOfTheMonth
        .toLocaleDateString("en", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replaceAll("/", "-")
    : undefined;

  const body: IExpensesFilters = {
    month: !isExpensesPage ? selectedMonth : null,
    fromDate: isExpensesPage ? selectedMonth : null,
    toDate: isExpensesPage ? selectedToMonth! : null,
  };

  const { data, error } = await fetchResource<IExpense[]>({
    url: "/expense/filter",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(body),
      },
    },
  });

  if (data) {
    for (const expense of data) {
      const [year, month, day] = expense.expenseDate.split("-").map(Number);

      expense.expenseDate = new Date(year, month - 1, day).toLocaleDateString(
        locale,
        { weekday: "short", day: "2-digit", month: "short" }
      );
    }
  }

  return (
    <Expenses
      locale={locale}
      initialExpenses={data ? groupExpensesByCategory(data!) : undefined}
      error={error}
      limit={limit}
      displayFilters={displayFilters}
    />
  );
}
