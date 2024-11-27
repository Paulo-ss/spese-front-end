import { fetchResource } from "@/services/fetchService";
import MonthSummary from "../client/MonthSummary";
import { IMonthSummary } from "@/interfaces/analytics.interface";

interface IProps {
  locale: string;
}

export default async function MonthSummaryServer({ locale }: IProps) {
  const currentMonth = new Date()
    .toLocaleDateString("en", {
      month: "numeric",
      year: "numeric",
    })
    .replace("/", "-");

  const { data, error } = await fetchResource<IMonthSummary>({
    url: "/analytics/month-summary",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({ month: currentMonth }),
        next: { tags: ["month-summary"] },
      },
    },
  });

  return (
    <MonthSummary initialMonthSummary={data} error={error} locale={locale} />
  );
}
