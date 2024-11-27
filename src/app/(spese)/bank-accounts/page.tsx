import BankAccountsServer from "@/components/bankAccounts/server/BankAccountsServer";
import PageContainer from "@/components/pageContainer/PageContainer";
import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { Suspense } from "react";

export default function BankAccountsPage() {
  return (
    <PageContainer title="bankAccount.yourBankAccounts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <Suspense
            fallback={
              <CardLoading>
                <ListItemLoading items={6} />
              </CardLoading>
            }
          >
            <BankAccountsServer />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
