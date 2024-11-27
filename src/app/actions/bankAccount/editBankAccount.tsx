"use server";

import { fetchResource } from "@/services/fetchService";
import {
  IBankAccount,
  IBankAccountForm,
} from "@/interfaces/bank-account.interface";
import { revalidateTag } from "next/cache";

export default async function editBankAccount(
  bankAccountId: number,
  bankAccount: IBankAccountForm
) {
  const { data, error } = await fetchResource<IBankAccount>({
    url: `/bank-account/${bankAccountId}`,
    config: {
      options: {
        method: "PUT",
        body: JSON.stringify(bankAccount),
      },
    },
  });

  revalidateTag("bank-accounts");

  return { data, error };
}
