import { IExpense } from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";
import Expenses from "../client/Expenses";
import { getLanguage } from "@/app/actions/cookies/getLanguague";

interface IProps {
  limit?: number;
}

export default async function ExpensesServer({ limit }: IProps) {
  const locale = await getLanguage();

  const currentMonth = new Date()
    .toLocaleDateString("en", { day: "2-digit", month: "2-digit" })
    .replace("/", "-");

  const { data, error } = await fetchResource<IExpense[]>({
    url: "/expense/filter",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({ fromMonth: currentMonth }),
      },
    },
  });

  if (data) {
    for (const expense of data) {
      expense.expenseDate = new Date(expense.expenseDate).toLocaleDateString(
        locale,
        { weekday: "short", day: "2-digit", month: "short" }
      );
    }
  }

  return (
    <Expenses
      locale={locale}
      initialExpenses={data}
      error={error}
      limit={limit}
    />
  );
}
