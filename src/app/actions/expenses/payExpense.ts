"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";

export default async function payExpense(expenseId: number) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/expense/pay/${expenseId}`,
    config: {
      options: {
        method: "PUT",
      },
    },
  });

  return { data, error };
}
