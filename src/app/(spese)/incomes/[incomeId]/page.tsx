import { getLanguage } from "@/app/actions/cookies/getLanguague";
import IncomeForm from "@/components/forms/incomes/IncomesForm";
import PageContainer from "@/components/pageContainer/PageContainer";
import { IIncome } from "@/interfaces/income.interface";
import { fetchResource } from "@/services/fetchService";

export default async function EditIncomePage({
  params,
}: {
  params: { incomeId: string };
}) {
  const locale = await getLanguage();

  const { data: income, error } = await fetchResource<IIncome>({
    url: `/income/${params.incomeId}`,
  });

  return (
    <PageContainer title="incomes.newIncome">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <IncomeForm income={income} error={error} locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
