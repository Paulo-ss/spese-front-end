import { getLanguage } from "@/app/actions/cookies/getLanguague";
import PageContainer from "@/components/pageContainer/PageContainer";
import Wages from "@/components/wage/Wages";
import { IWage } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";

export default async function WagePage() {
  const { data: wages, error } = await fetchResource<IWage[]>({
    url: "/income/wage/all/user",
    config: { options: { next: { tags: ["wage"] } } },
  });

  const locale = await getLanguage();

  return (
    <PageContainer title="bankAccount.yourBankAccounts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <Wages wages={wages} error={error} locale={locale} />
        </div>
      </div>
    </PageContainer>
  );
}
