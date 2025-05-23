"use server";

import { IWage, IWageForm } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";

export default async function editWage(wage: IWageForm, wageId: number) {
  const { data, error } = await fetchResource<IWage>({
    url: `/income/wage/${wageId}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify(wage),
      },
    },
  });

  revalidateTag("wage");

  return { data, error };
}
