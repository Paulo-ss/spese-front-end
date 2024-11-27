import BankAccountForm from "@/components/forms/bankAccount/BankAccountForm";
import PageContainer from "@/components/pageContainer/PageContainer";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import { fetchResource } from "@/services/fetchService";

export default async function EditBankAccountPage({
  params,
}: {
  params: { bankAccountId: string };
}) {
  const { data: bankAccount, error } = await fetchResource<IBankAccount>({
    url: `/bank-account/${params.bankAccountId}`,
  });

  return (
    <PageContainer title="bankAccount.editBankAccount">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <BankAccountForm bankAccount={bankAccount} error={error} />
        </div>
      </div>
    </PageContainer>
  );
}
