"use server";

import { IIncome } from "@/interfaces/income.interface";
import { ISubscriptionForm } from "@/interfaces/subscription.interface";
import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";

export default async function saveSubscription(formData: ISubscriptionForm) {
  const { data, error } = await fetchResource<IIncome>({
    url: "/credit-card/subscription",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(formData),
      },
    },
  });

  revalidateTag("incomes");

  return { data, error };
}
