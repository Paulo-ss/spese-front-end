"use server";

import { IWage } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";

export default async function saveWage(wage: string) {
  const fixedWage = Number(wage).toFixed(2);

  const { data, error } = await fetchResource<IWage>({
    url: "/income/wage",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({ wage: Number(fixedWage) }),
      },
    },
  });

  return { data, error };
}
