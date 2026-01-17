import { fetchResource } from "@/services/fetchService";
import MonthSummary from "../client/MonthSummary";
import { IMonthSummary } from "@/interfaces/analytics.interface";
import { formatDate } from "@/utils/dates/dateUtils";

interface IProps {
  locale: string;
}

export default async function MonthSummaryServer({ locale }: IProps) {
  const currentMonth = formatDate(new Date(), "YYYY-MM");

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
