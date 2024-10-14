import SignUpForm from "@/components/forms/signUp/SignUpForm";
import PageContainer from "@/components/pageContainer/PageContainer";

const SignUpPage = () => {
  return (
    <PageContainer
      title="cadastre-se - spese"
      description="Página para criar uma conta Spese"
    >
      <SignUpForm />
    </PageContainer>
  );
};

export default SignUpPage;
