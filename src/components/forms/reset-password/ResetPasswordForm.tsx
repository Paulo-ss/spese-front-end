"use client";

import Input from "@/components/ui/input/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import {
  IconCheckbox,
  IconChevronLeft,
  IconLogin,
  IconMailCheck,
  IconRefresh,
  IconSend,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { IResetPassword } from "@/interfaces/reset-password.interface";
import askForResetPasswordToken from "@/app/actions/auth/askForResetPasswordToken";

const ResetPasswordForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm<IResetPassword>();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data: IResetPassword) => {
    setIsLoading(true);

    const { responseData, error } = await askForResetPasswordToken(data);

    if (error?.errorMessage) {
      toast({
        title: "erro",
        description: error.errorMessage,
        variant: "destructive",
      });

      setIsLoading(false);
      return;
    }

    toast({
      title: "e-mail enviado.",
      description: responseData?.message,
      action: <IconCheckbox className="w-6 h-6" color="#86EFAC" />,
    });

    setIsLoading(false);
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="h-full flex flex-col justify-center items-center px-2 md:px-6">
        <Fade direction="up" duration={500} cascade>
          <IconMailCheck className="w-20 h-20" color="#86EFAC" />

          <h3 className="text-lg font-bold text-center dark:text-zinc-50">
            verifique o seu e-mail
          </h3>

          <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 w-96">
            enviamos um link para <b>{getValues("email")}</b>e você tem 30
            minutos para realizar a alteração da sua senha
          </p>

          <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 mb-5 w-96">
            se o e-mail não aparecer em sua caixa de entrada,{" "}
            <b>confira sua pasta de spam</b>
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              text="fazer login"
              type="button"
              color="primary"
              variant="outlined"
              trailing={<IconLogin />}
              onClick={() => {
                setEmailSent(false);
                router.push("/auth/sign-in");
              }}
            />

            <Button
              text="reenviar email"
              type="button"
              color="info"
              trailing={<IconRefresh />}
              onClick={() => {
                setEmailSent(false);
              }}
            />
          </div>
        </Fade>
      </div>
    );
  }

  return (
    <form
      className="h-full flex flex-col justify-center px-2 md:px-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fade direction="up" duration={300} cascade>
        <h2 className="text-2xl font-bold dark:text-zinc-50">
          recuperar senha
        </h2>

        <p className="text-sm text-gray-700 mt-2 mb-5 dark:text-zinc-50">
          informe o e-mail da conta a ser recuperada
        </p>

        <Controller
          control={control}
          name="email"
          rules={{
            required: { value: true, message: "campo obrigatório" },
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "digite um e-mail válido",
            },
          }}
          render={({ field }) => (
            <Input
              type="text"
              label="e-mail"
              {...field}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
            />
          )}
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            type="button"
            text="voltar"
            variant="outlined"
            color="error"
            leading={<IconChevronLeft />}
            onClick={() => {
              router.back();
            }}
          />

          <Button
            type="submit"
            text="enviar"
            color="primary"
            trailing={<IconSend />}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </Fade>
    </form>
  );
};

export default ResetPasswordForm;
