"use server";

import { fetchResource } from "@/services/fetchService";
import { IBankAccountForm } from "@/interfaces/bank-account.interface";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";
import { revalidateTag } from "next/cache";

export default async function saveMultipleBankAccounts(
  bankAccounts: IBankAccountForm[]
) {
  const { data, error } = await fetchResource<IGenericMessageResponse>({
    url: "/bank-account/create-multiple",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify(bankAccounts),
      },
    },
  });

  revalidateTag("bank-accounts");

  return { data, error };
}
