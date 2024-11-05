import SignInForm from "@/components/forms/signIn/SignInForm";
import PageContainer from "@/components/pageContainer/PageContainer";

const SignInPage = () => {
  return (
    <PageContainer title="utils.signIn" description="Página de login do spese">
      <SignInForm />
    </PageContainer>
  );
};

export default SignInPage;
