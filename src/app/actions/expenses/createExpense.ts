"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { IExpenseForm } from "@/interfaces/expenses.interface";

export default async function createExpense(expense: IExpenseForm) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: "/expense",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({
          ...expense,
          expenseDate: expense.expenseDate
            ?.toLocaleDateString("en", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
            .replaceAll("/", "-"),
          bankAccountId: Number(expense.bankAccountId),
          creditCardId: Number(expense.creditCardId),
          installments: Number(expense.installments),
          customCategory: Number(expense.customCategory),
        }),
      },
    },
  });

  return { data, error };
}
