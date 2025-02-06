import { getLanguage } from "@/app/actions/cookies/getLanguague";
import PageContainer from "@/components/pageContainer/PageContainer";
import WageDetails from "@/components/wage/WageDetails";
import { IWage } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";

export default async function EditSubscriptionPage({
  params,
}: {
  params: { wageId: string };
}) {
  const locale = await getLanguage();

  const { data: wage, error } = await fetchResource<IWage>({
    url: `/income/wage/${params.wageId}`,
  });

  return (
    <PageContainer title="subscriptions.editSubscription">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <WageDetails wage={wage} error={error} locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
