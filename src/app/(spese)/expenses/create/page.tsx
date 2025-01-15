import { getLanguage } from "@/app/actions/cookies/getLanguague";
import ExpenseForm from "@/components/forms/expenses/ExpenseForm";
import PageContainer from "@/components/pageContainer/PageContainer";

export default async function CreateExpensePage() {
  const locale = await getLanguage();

  return (
    <PageContainer title="expenses.newExpense">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <ExpenseForm locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
