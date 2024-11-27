import { fetchResource } from "@/services/fetchService";
import CreditCardsSummary from "../client/CreditCardsSummary";
import { ICreditCardSummary } from "@/interfaces/credit-card.interface";

interface IProps {
  locale: string;
}

export default async function CreditCardsSummaryServer({ locale }: IProps) {
  const { data, error } = await fetchResource<ICreditCardSummary[]>({
    url: "/credit-card/all/user",
    config: {
      options: {
        next: { tags: ["credit-cards-summary"] },
      },
    },
  });

  if (data) {
    for (const creditCard of data) {
      creditCard.closingDate = new Date(
        creditCard.closingDate
      ).toLocaleDateString(locale, { day: "2-digit", month: "2-digit" });
    }
  }

  return (
    <CreditCardsSummary creditCards={data} error={error} locale={locale} />
  );
}
