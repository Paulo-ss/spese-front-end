import { getLanguage } from "@/app/actions/cookies/getLanguague";
import Incomes from "@/components/incomes/Incomes";
import MonthRangePicker from "@/components/monthRangePicker/MonthRangePicker";
import PageContainer from "@/components/pageContainer/PageContainer";
import { GlobalDateContextProvider } from "@/contexts/GlobalDateContext";
import { IIncome } from "@/interfaces/income.interface";
import { fetchResource } from "@/services/fetchService";

export default async function IncomesPage() {
  const locale = await getLanguage();

  const [year, month] = new Date()
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);
  const [fromYear, fromMonth, fromDay] = new Date(year, month - 1)
    .toISOString()
    .split("T")[0]
    .split("-");
  const [toYear, toMonth, toDay] = new Date(year, month, 0)
    .toISOString()
    .split("T")[0]
    .split("-");

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
      income.incomeMonth = new Date(income.incomeMonth).toLocaleDateString(
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
