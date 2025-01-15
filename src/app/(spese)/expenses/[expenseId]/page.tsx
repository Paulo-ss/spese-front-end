import { getLanguage } from "@/app/actions/cookies/getLanguague";
import ExpenseDetails from "@/components/expenses/client/ExpenseDetails";
import PageContainer from "@/components/pageContainer/PageContainer";
import { IExpense } from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";

export default async function ExpenseDetailsPage({
  params,
}: {
  params: { expenseId: string };
}) {
  const { data: expense, error } = await fetchResource<IExpense>({
    url: `/expense/${params.expenseId}`,
    config: { options: { next: { tags: ["expense-details"] } } },
  });

  const locale = await getLanguage();

  return (
    <PageContainer title="creditCard.yourCreditCard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <ExpenseDetails expense={expense} error={error} locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
