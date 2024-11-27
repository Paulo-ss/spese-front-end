import MonthPicker from "@/components/monthPicker/MonthPicker";
import PageContainer from "@/components/pageContainer/PageContainer";
import { GlobalDateContextProvider } from "@/contexts/GlobalDateContext";
import { getLanguage } from "../actions/cookies/getLanguague";
import { Suspense } from "react";
import MonthSummaryServer from "@/components/analytics/server/MonthSummaryServer";
import MonthSummaryLoading from "@/components/analytics/loding/MonthSummaryLoading";
import CreditCardsSummaryServer from "@/components/creditCards/summary/server/CreditCardsSummaryServer";
import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import BankAccountsServer from "@/components/bankAccounts/server/BankAccountsServer";
import ExpensesServer from "@/components/expenses/server/ExpensesServer";

export default async function Home() {
  const locale = await getLanguage();

  return (
    <PageContainer title="utils.home">
      <GlobalDateContextProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 flex">
            <MonthPicker locale={locale} />
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense fallback={<MonthSummaryLoading />}>
              <MonthSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense
              fallback={
                <CardLoading>
                  <ListItemLoading items={4} />
                </CardLoading>
              }
            >
              <ExpensesServer limit={5} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense
              fallback={
                <CardLoading>
                  <ListItemLoading items={4} />
                </CardLoading>
              }
            >
              <CreditCardsSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense
              fallback={
                <CardLoading>
                  <ListItemLoading items={4} />
                </CardLoading>
              }
            >
              <BankAccountsServer />
            </Suspense>
          </div>
        </div>
      </GlobalDateContextProvider>
    </PageContainer>
  );
}
