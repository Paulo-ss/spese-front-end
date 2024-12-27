import { getLanguage } from "@/app/actions/cookies/getLanguague";
import ExpensesServer from "@/components/expenses/server/ExpensesServer";
import MonthRangePicker from "@/components/monthRangePicker/MonthRangePicker";
import PageContainer from "@/components/pageContainer/PageContainer";
import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { GlobalDateContextProvider } from "@/contexts/GlobalDateContext";
import { Suspense } from "react";

export default async function ExpensesPage() {
  const locale = await getLanguage();

  return (
    <PageContainer title="suas despesas - spese">
      <GlobalDateContextProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 flex">
            <MonthRangePicker locale={locale} />
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Suspense
              fallback={
                <CardLoading>
                  <ListItemLoading items={4} />
                </CardLoading>
              }
            >
              <ExpensesServer />
            </Suspense>
          </div>
        </div>
      </GlobalDateContextProvider>
    </PageContainer>
  );
}
