import ResetPasswordForm from "@/components/forms/reset-password/ResetPasswordForm";
import PageContainer from "@/components/pageContainer/PageContainer";
import React from "react";

const ResetPasswordPage = () => {
  return (
    <PageContainer
      title="recoverPassword"
      description="Página para recuperação de senha do usuário"
    >
      <ResetPasswordForm />
    </PageContainer>
  );
};

export default ResetPasswordPage;
