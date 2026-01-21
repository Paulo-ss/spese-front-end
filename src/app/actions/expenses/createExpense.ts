"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { IExpenseForm } from "@/interfaces/expenses.interface";
import { formatDate } from "@/utils/dates/dateUtils";

export default async function createExpense(expense: IExpenseForm) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: "/expense",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({
          ...expense,
          expenseDate: formatDate(expense.expenseDate!, "YYYY-MM-DD"),
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
