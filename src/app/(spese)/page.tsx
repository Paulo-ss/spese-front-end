import MonthPicker from "@/components/monthPicker/MonthPicker";
import PageContainer from "@/components/pageContainer/PageContainer";
import { GlobalDateContextProvider } from "@/contexts/GlobalDateContext";
import { getLanguage } from "../actions/cookies/getLanguague";
import { Suspense } from "react";
import MonthSummaryServer from "@/components/analytics/server/MonthSummaryServer";
import MonthSummaryLoading from "@/components/analytics/loding/MonthSummaryLoading";
import CreditCardsSummaryServer from "@/components/creditCards/summary/server/CreditCardsSummaryServer";

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
            <Suspense fallback={<MonthSummaryLoading />}>
              <MonthSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense fallback={<MonthSummaryLoading />}>
              <MonthSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense fallback={<MonthSummaryLoading />}>
              <MonthSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense fallback={<MonthSummaryLoading />}>
              <MonthSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense fallback={<MonthSummaryLoading />}>
              <MonthSummaryServer locale={locale} />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense fallback={<div>carregando...</div>}>
              <CreditCardsSummaryServer locale={locale} />
            </Suspense>
          </div>
        </div>
      </GlobalDateContextProvider>
    </PageContainer>
  );
}
