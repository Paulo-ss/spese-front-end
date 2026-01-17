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
import { useRouter } from "next-nprogress-bar";
import { ISignUp } from "@/interfaces/sign-up.interface";
import signUp from "@/app/actions/auth/signUp";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useTranslations } from "next-intl";

const SignUpForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm<ISignUp>();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const onSubmit = async (data: ISignUp) => {
    setIsLoading(true);

    const { responseData, error } = await signUp({
      ...data,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (error?.errorMessage) {
      toast({
        title: t("error"),
        description: error.errorMessage,
        variant: "destructive",
      });

      setIsLoading(false);
      return;
    }

    toast({
      title: t("accountSuccessfullyCreated"),
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
            {t("confirmYourEmailAndActivateYourAccount")}
          </h3>

          <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 w-96">
            {t("weHaveSentALinkTo")} <b>{getValues("email")}</b>{" "}
            {t("utils.and")} {t("andYouHave1HourToConfirm")}
          </p>

          <p className="text-sm text-gray-700 dark:text-zinc-50 text-center mt-5 w-96 mb-5">
            {t("ifYouDontSeeTheEmail")}, <b>{t("checkSpamFolder")}</b>
          </p>

          <Button
            text={t("signin")}
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
          {t("register")}
        </h2>

        <div className="mt-2">
          <Controller
            control={control}
            defaultValue=""
            name="name"
            rules={{
              required: { value: true, message: t("utils.requiredField") },
            }}
            render={({ field }) => (
              <Input
                type="type"
                label={t("yourName")}
                {...field}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            )}
          />
        </div>

        <div className="mt-2">
          <Controller
            control={control}
            defaultValue=""
            name="email"
            rules={{
              required: { value: true, message: t("utils.requiredField") },
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: t("validationMessages.typeAValidEmail"),
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
        </div>

        <div className="mt-2">
          <Controller
            control={control}
            defaultValue=""
            name="password"
            rules={{
              required: { value: true, message: t("utils.requiredField") },
              pattern: {
                value:
                  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g,
                message: t("validationMessages.password"),
              },
            }}
            render={({ field }) => (
              <Input
                type="password"
                label={t("password")}
                {...field}
                error={!!errors.password?.message}
                helperText={errors.password?.message}
              />
            )}
          />
        </div>

        <div className="mt-2">
          <Controller
            control={control}
            defaultValue=""
            name="passwordConfirmation"
            rules={{
              required: { value: true, message: t("utils.requiredField") },
              validate: (value) => {
                if (value !== getValues("password")) {
                  return t("validationMessages.passwordConfirmation");
                }
              },
            }}
            render={({ field }) => (
              <Input
                type="password"
                label={t("passwordConfirmation")}
                {...field}
                error={!!errors.passwordConfirmation?.message}
                helperText={errors.passwordConfirmation?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <Button
            type="button"
            text={t("utils.goBack")}
            variant="outlined"
            color="error"
            leading={<IconChevronLeft />}
            onClick={() => {
              router.back();
            }}
          />

          <Button
            type="submit"
            text={t("register")}
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
