import { IBankAccount } from "@/interfaces/bank-account.interface";
import { fetchResource } from "@/services/fetchService";
import BankAccounts from "../client/BankAccounts";
import { getLanguage } from "@/app/actions/cookies/getLanguague";

export default async function BankAccountsServer() {
  const locale = await getLanguage();

  const { data, error } = await fetchResource<IBankAccount[]>({
    url: "/bank-account/all/user",
    config: { options: { next: { tags: ["bank-accounts"] } } },
  });

  return <BankAccounts bankAccounts={data} error={error} locale={locale} />;
}
