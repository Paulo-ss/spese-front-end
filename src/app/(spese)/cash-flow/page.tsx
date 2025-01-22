import PageContainer from "@/components/pageContainer/PageContainer";
import CashFlow from "@/components/cashFlow/CashFlow";
import { getLanguage } from "@/app/actions/cookies/getLanguague";

export default async function CashFlowPage() {
  const locale = await getLanguage();

  return (
    <PageContainer title="menuItems.cashFlow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <CashFlow locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
