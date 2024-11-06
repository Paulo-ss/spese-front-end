import confirmEmailToken from "@/app/actions/auth/confirmEmail";
import ConfirmEmail from "@/components/auth/confirmEmail/ConfirmEmail";
import PageContainer from "@/components/pageContainer/PageContainer";
import { redirect } from "next/navigation";
import React from "react";

const ConfirmEmailPage = async ({
  params: { token },
}: {
  params: { token: string };
}) => {
  if (!token) {
    redirect("/auth/sign-in");
  }

  const { error } = await confirmEmailToken({
    confirmationToken: token,
  });

  return (
    <PageContainer
      title="confirmAccount"
      description="Página para confirmação do e-mail da conta do usuário"
    >
      <ConfirmEmail error={error?.errorMessage} />
    </PageContainer>
  );
};

export default ConfirmEmailPage;
