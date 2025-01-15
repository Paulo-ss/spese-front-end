"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { IExpenseForm } from "@/interfaces/expenses.interface";

export default async function editExpense(
  expenseId: number,
  expense: IExpenseForm
) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/expense/${expenseId}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify({
          ...expense,
          expenseDate: expense.expenseDate
            ?.toLocaleDateString("en")
            .replaceAll("/", "-"),
        }),
      },
    },
  });

  return { data, error };
}
