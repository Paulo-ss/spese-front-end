import ConfirmEmail from "@/components/auth/confirmEmail/ConfirmEmail";
import ResetPassword from "@/components/auth/reset-password/ResetPassword";
import PageContainer from "@/components/pageContainer/PageContainer";
import { redirect } from "next/navigation";
import React from "react";

const ResetPasswordTokenPage = async ({
  params: { token },
}: {
  params: { token: string };
}) => {
  if (!token) {
    redirect("/auth/sign-in");
  }

  return (
    <PageContainer
      title="confirmar conta - spese"
      description="Página para confirmação do e-mail da conta do usuário"
    >
      <ResetPassword resetToken={token} />
    </PageContainer>
  );
};

export default ResetPasswordTokenPage;
