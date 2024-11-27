"use server";

import { IWage } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";

export default async function editWage(wage: string) {
  const fixedWage = Number(wage).toFixed(2);

  const { data, error } = await fetchResource<IWage>({
    url: "/income/wage/user",
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify({ wage: Number(fixedWage) }),
      },
    },
  });

  revalidateTag("wage");

  return { data, error };
}
