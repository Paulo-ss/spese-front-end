"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { ICreditCard } from "@/interfaces/credit-card.interface";

export default async function saveMultipleCreditCards(
  creditCards: ICreditCard[]
) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: "/credit-card/create-multiple",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(creditCards),
      },
    },
  });

  return { data, error };
}
