"use client";

import Input from "@/components/ui/input/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import {
  IconCheckbox,
  IconChevronLeft,
  IconLogin,
  IconMailCheck,
  IconSend,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ISignUp } from "@/interfaces/sign-up.interface";
import signUp from "@/app/actions/auth/signUp";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";

const SignUpForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm<ISignUp>();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const onSubmit = async (data: ISignUp) => {
    setIsLoading(true);

    const { responseData, error } = await signUp(data);

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
      title: "conta criada com sucesso.",
      description: responseData?.message,
      action: <IconCheckbox className="w-6 h-6" color="#86EFAC" />,
    });

    setIsLoading(false);
    setAccountCreated(true);
  };

  if (accountCreated) {
    return (
      <div className="h-full flex flex-col justify-center items-center px-2 md:px-6">
        <Fade direction="up" duration={500} cascade>
          <IconMailCheck className="w-20 h-20" color="#86EFAC" />

          <h3 className="text-lg font-bold text-center dark:text-zinc-50">
            confirme seu e-mail e ative sua conta
          </h3>

          <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 w-96">
            enviamos um link para <b>{getValues("email")}</b> e você tem 1h para
            realizar a confirmação
          </p>

          <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 w-96 mb-5">
            se o e-mail não aparecer em sua caixa de entrada,{" "}
            <b>confira sua pasta de spam</b>
          </p>

          <Button
            text="fazer login"
            type="button"
            color="primary"
            variant="outlined"
            trailing={<IconLogin />}
            onClick={() => {
              setAccountCreated(false);
              router.push("/auth/sign-in");
            }}
          />
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
        <h2 className="text-2xl font-bold mb-4 dark:text-emerald-50">
          cadastre-se
        </h2>

        <Controller
          control={control}
          name="name"
          rules={{ required: { value: true, message: "campo obrigatório" } }}
          render={({ field }) => (
            <Input
              type="type"
              label="seu nome"
              {...field}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
            />
          )}
        />

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

        <Controller
          control={control}
          name="password"
          rules={{
            required: { value: true, message: "campo obrigatório" },
            pattern: {
              value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g,
              message:
                "a senha precisa ter um número, letra maiúscula e um caracter especial",
            },
          }}
          render={({ field }) => (
            <Input
              type="password"
              label="senha"
              {...field}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="passwordConfirmation"
          rules={{
            required: { value: true, message: "campo obrigatório" },
            validate: (value) => {
              if (value !== getValues("password")) {
                return "as senhas não são iguais";
              }
            },
          }}
          render={({ field }) => (
            <Input
              type="password"
              label="confirme sua senha"
              {...field}
              error={!!errors.passwordConfirmation?.message}
              helperText={errors.passwordConfirmation?.message}
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
            text="cadastrar"
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

export default SignUpForm;
