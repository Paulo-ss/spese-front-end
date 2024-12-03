import { getLanguage } from "@/app/actions/cookies/getLanguague";
import IncomeForm from "@/components/forms/incomes/IncomesForm";
import PageContainer from "@/components/pageContainer/PageContainer";

export default async function CreateIncomePage() {
  const locale = await getLanguage();

  return (
    <PageContainer title="incomes.newIncome">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <IncomeForm locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
