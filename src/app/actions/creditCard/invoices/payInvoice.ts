"use server";

import { fetchResource } from "@/services/fetchService";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { revalidatePath } from "next/cache";

export default async function payInvoice(invoiceId: number) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: `/credit-card/invoice/pay/${invoiceId}`,
    config: {
      options: {
        method: "PUT",
      },
    },
  });

  if (!error) {
    revalidatePath(`/credit-cards/[creditCardId]`);
  }

  return { data, error };
}
