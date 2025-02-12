import PageContainer from "@/components/pageContainer/PageContainer";
import CashFlow from "@/components/cashFlow/CashFlow";
import { getLanguage } from "@/app/actions/cookies/getLanguague";
import { fetchResource } from "@/services/fetchService";
import { ICashFlowResponse } from "@/interfaces/cash-flow.interface";

const currentMonth = new Date()
  .toLocaleDateString("en", { month: "2-digit", year: "numeric" })
  .replaceAll("/", "-");

export default async function CashFlowPage() {
  const locale = await getLanguage();

  const { data: cashFlow, error } = await fetchResource<ICashFlowResponse>({
    url: `/cash-flow/month/${currentMonth}`,
  });

  if (cashFlow) {
    for (const key in cashFlow.dailyCashFlow) {
      if (cashFlow.dailyCashFlow[key].transactions) {
        cashFlow.dailyCashFlow[key].transactions.forEach(
          (transaction, index) => {
            const start = String(transaction.start);
            const [startYear, startMonth, startDay] = start
              .split("-")
              .map(Number);
            cashFlow.dailyCashFlow[key].transactions[index].start = new Date(
              startYear,
              startMonth - 1,
              startDay,
              3,
              0,
              0
            );

            const end = String(transaction.end);
            const [endYear, endMonth, endDay] = end.split("-").map(Number);
            cashFlow.dailyCashFlow[key].transactions[index].end = new Date(
              endYear,
              endMonth - 1,
              endDay,
              3,
              0,
              0
            );
          }
        );
      }
    }
  }

  return (
    <PageContainer title="menuItems.cashFlow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <CashFlow cashFlow={cashFlow} error={error} locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
