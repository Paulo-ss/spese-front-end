import { getLanguage } from "@/app/actions/cookies/getLanguague";
import CreditCardDetails from "@/components/creditCards/CreditCardDetails";
import PageContainer from "@/components/pageContainer/PageContainer";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import { fetchResource } from "@/services/fetchService";

export default async function CreditCardPage({
  params,
}: {
  params: { creditCardId: string };
}) {
  const { data: creditCard, error } = await fetchResource<ICreditCard>({
    url: `/credit-card/${params.creditCardId}`,
    config: { options: { next: { tags: ["credit-card-details"] } } },
  });

  const locale = await getLanguage();

  return (
    <PageContainer title="creditCard.yourCreditCard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <CreditCardDetails
            creditCard={creditCard}
            error={error}
            locale={locale}
          />
        </div>
      </div>
    </PageContainer>
  );
}
