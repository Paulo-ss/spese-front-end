import { fetchResource } from "@/services/fetchService";
import CreditCardsSummary from "../client/CreditCardsSummary";
import { ICreditCardSummary } from "@/interfaces/credit-card.interface";

interface IProps {
  locale: string;
}

export default async function CreditCardsSummaryServer({ locale }: IProps) {
  const { data, error } = await fetchResource<ICreditCardSummary[]>({
    url: "/credit-card/all/user",
    config: { options: { next: { tags: ["credit-cards-summary"] } } },
  });

  return (
    <CreditCardsSummary creditCards={data} error={error} locale={locale} />
  );
}
