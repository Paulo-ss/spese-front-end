"use server";

import { IIncome } from "@/interfaces/income.interface";
import { ISubscriptionForm } from "@/interfaces/subscription.interface";
import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";

export default async function editSubscription(
  formData: ISubscriptionForm,
  subscriptionId: number
) {
  const { data, error } = await fetchResource<IIncome>({
    url: `/credit-card/subscription/${subscriptionId}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          billingDay: Number(formData.billingDay),
        }),
      },
    },
  });

  revalidateTag("incomes");

  return { data, error };
}
