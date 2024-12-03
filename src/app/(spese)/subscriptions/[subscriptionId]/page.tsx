import SubscriptionForm from "@/components/forms/subscription/SubscriptionForm";
import PageContainer from "@/components/pageContainer/PageContainer";
import { ISubscription } from "@/interfaces/subscription.interface";
import { fetchResource } from "@/services/fetchService";

export default async function EditSubscriptionPage({
  params,
}: {
  params: { subscriptionId: string };
}) {
  const { data: subscription, error } = await fetchResource<ISubscription>({
    url: `/credit-card/subscription/${params.subscriptionId}`,
  });

  return (
    <PageContainer title="subscriptions.editSubscription">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <SubscriptionForm subscription={subscription} error={error} />
        </div>
      </div>
    </PageContainer>
  );
}
