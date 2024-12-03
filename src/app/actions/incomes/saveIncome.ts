"use server";

import { IIncome, IIncomeForm } from "@/interfaces/income.interface";
import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";

export default async function saveIncome(formDate: IIncomeForm) {
  const body = {
    ...formDate,
    incomeMonth: formDate.date
      .toLocaleDateString("en", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .replaceAll("/", "-"),
  };

  const { data, error } = await fetchResource<IIncome>({
    url: "/income",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(body),
      },
    },
  });

  revalidateTag("incomes");

  return { data, error };
}
