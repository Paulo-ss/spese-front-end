"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { IExpenseForm } from "@/interfaces/expenses.interface";
import { revalidateTag } from "next/cache";

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
            ?.toLocaleDateString("en", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
            .replaceAll("/", "-"),
        }),
      },
    },
  });

  revalidateTag("expense-details");

  return { data, error };
}
