import { getLanguage } from "@/app/actions/cookies/getLanguague";
import CreditCardsSummaryServer from "@/components/creditCards/summary/server/CreditCardsSummaryServer";
import PageContainer from "@/components/pageContainer/PageContainer";
import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { Suspense } from "react";

export default async function CreditCardsPage() {
  const locale = await getLanguage();

  return (
    <PageContainer title="creditCard.yourCreditCards">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <Suspense
            fallback={
              <CardLoading>
                <ListItemLoading items={6} />
              </CardLoading>
            }
          >
            <CreditCardsSummaryServer locale={locale} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
