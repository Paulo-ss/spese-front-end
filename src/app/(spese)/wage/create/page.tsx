import WageForm from "@/components/forms/wage/WageForm";
import PageContainer from "@/components/pageContainer/PageContainer";

export default async function CreateWagesPage() {
  return (
    <PageContainer title="subscriptions.createSubscription">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <WageForm />
        </div>
      </div>
    </PageContainer>
  );
}
