import BankAccountForm from "@/components/forms/bankAccount/BankAccountForm";
import PageContainer from "@/components/pageContainer/PageContainer";

export default function CreateBankAccountsPage() {
  return (
    <PageContainer title="bankAccount.registerYourBankAccount">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <BankAccountForm />
        </div>
      </div>
    </PageContainer>
  );
}
