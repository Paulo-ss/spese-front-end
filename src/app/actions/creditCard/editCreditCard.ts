"use server";

import { fetchResource } from "@/services/fetchService";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import { revalidateTag } from "next/cache";

export default async function editCreditCard(creditCard: ICreditCard) {
  const { data, error } = await fetchResource<ICreditCard>({
    url: `/credit-card/${creditCard.id}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify({
          ...creditCard,
          limit: Number(creditCard.limit),
        }),
      },
    },
  });

  revalidateTag("credit-card-details");

  return { data, error };
}
