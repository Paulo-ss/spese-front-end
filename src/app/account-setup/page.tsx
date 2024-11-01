import AccountSetup from "@/components/accountSetup/AccountSetup";
import PageContainer from "@/components/pageContainer/PageContainer";

export default function AccountSetupPage() {
  return (
    <PageContainer
      title="complete sua conta - spese"
      description="Página para finalizar os detalhes da conta do usuário"
    >
      <AccountSetup />
    </PageContainer>
  );
}
