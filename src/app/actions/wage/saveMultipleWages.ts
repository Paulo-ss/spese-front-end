"use server";

import { IWage, IWageForm } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";

export default async function saveMultipleWages(wages: IWageForm[]) {
  const { data, error } = await fetchResource<IWage>({
    url: "/income/wage/multiple",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(wages),
      },
    },
  });

  return { data, error };
}
