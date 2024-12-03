import { getLanguage } from "@/app/actions/cookies/getLanguague";
import PageContainer from "@/components/pageContainer/PageContainer";
import Subscriptions from "@/components/subscriptions/Subscriptions";
import { ISubscription } from "@/interfaces/subscription.interface";
import { fetchResource } from "@/services/fetchService";

export default async function SubscriptionsPage() {
  const locale = await getLanguage();

  const { data: subscriptions, error } = await fetchResource<ISubscription[]>({
    url: "/credit-card/subscription/all/user",
    config: { options: { next: { tags: ["subscriptions"] } } },
  });

  return (
    <PageContainer title="incomes.yourIncomes">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <Subscriptions
            initialSubscriptions={subscriptions}
            error={error}
            locale={locale}
          />
        </div>
      </div>
    </PageContainer>
  );
}
