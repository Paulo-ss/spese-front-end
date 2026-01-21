"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { IExpenseForm } from "@/interfaces/expenses.interface";
import { revalidateTag } from "next/cache";
import { formatDate } from "@/utils/dates/dateUtils";

export default async function editExpense(
  expenseId: number,
  expense: IExpenseForm,
) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/expense/${expenseId}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify({
          ...expense,
          expenseDate: formatDate(expense.expenseDate!, "YYYY-MM-DD"),
        }),
      },
    },
  });

  revalidateTag("expense-details");

  return { data, error };
}
