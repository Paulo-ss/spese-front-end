"use server";

import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";

export default async function deleteIncome(incomeId: number) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/income/${incomeId}`,
    config: {
      options: {
        method: "DELETE",
      },
    },
  });

  revalidateTag("incomes");

  return { data, error };
}
