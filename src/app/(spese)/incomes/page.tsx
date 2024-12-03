import { getLanguage } from "@/app/actions/cookies/getLanguague";
import Incomes from "@/components/incomes/Incomes";
import MonthRangePicker from "@/components/monthRangePicker/MonthRangePicker";
import PageContainer from "@/components/pageContainer/PageContainer";
import { GlobalDateContextProvider } from "@/contexts/GlobalDateContext";
import { IIncome } from "@/interfaces/income.interface";
import { fetchResource } from "@/services/fetchService";

export default async function IncomesPage() {
  const locale = await getLanguage();

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [fromYear, fromMonth, fromDay] = oneMonthAgo
    .toISOString()
    .split("T")[0]
    .split("-");
  const [toYear, toMonth, toDay] = today.toISOString().split("T")[0].split("-");

  const { data: incomes, error } = await fetchResource<IIncome[]>({
    url: "/income/filter",
    config: {
      options: {
        method: "POST",
        body: JSON.stringify({
          fromDate: `${fromMonth}-${fromDay}-${fromYear}`,
          toDate: `${toMonth}-${toDay}-${toYear}`,
        }),
        next: { tags: ["incomes"] },
      },
    },
  });

  if (incomes) {
    for (const income of incomes) {
      const [year, month, day] = income.incomeMonth.split("-").map(Number);

      income.incomeMonth = new Date(year, month - 1, day).toLocaleDateString(
        locale,
        { weekday: "short", day: "2-digit", month: "short" }
      );
    }
  }

  return (
    <PageContainer title="incomes.yourIncomes">
      <GlobalDateContextProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 flex">
            <MonthRangePicker locale={locale} />
          </div>

          <div className="col-span-1 md:col-span-2 flex">
            <Incomes initialIncomes={incomes} error={error} locale={locale} />
          </div>
        </div>
      </GlobalDateContextProvider>
    </PageContainer>
  );
}
