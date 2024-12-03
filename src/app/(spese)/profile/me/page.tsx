import PageContainer from "@/components/pageContainer/PageContainer";
import Profile from "@/components/profile/Profile";
import { IUser } from "@/interfaces/user-data.interface";
import { fetchResource } from "@/services/fetchService";

export default async function ProfilePage() {
  const { data: user, error } = await fetchResource<IUser>({
    url: "/users/me",
  });

  return (
    <PageContainer title="incomes.yourIncomes">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <Profile user={user} error={error} />
        </div>
      </div>
    </PageContainer>
  );
}
