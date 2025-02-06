"use server";

import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";

export default async function deleteWage(wageId: number) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/incomes/wage/${wageId}`,
    config: {
      options: {
        method: "DELETE",
      },
    },
  });

  revalidateTag("wage");

  return { data, error };
}
