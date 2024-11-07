"use server";

import { fetchResource } from "@/services/fetchService";
import { IBankAccountForm } from "@/interfaces/bank-account.interface";
import { IGenericMessageResponse } from "@/interfaces/generic-message.interface";

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

  return { data, error };
}
