"use server";

import { fetchResource } from "@/services/fetchService";
import { revalidateTag } from "next/cache";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";

export default async function deleteSubscription(subscriptionId: number) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/credit-card/subscription/${subscriptionId}`,
    config: {
      options: {
        method: "DELETE",
      },
    },
  });

  revalidateTag("subscriptions");

  return { data, error };
}
