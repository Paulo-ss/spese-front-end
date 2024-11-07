"use client";

import Input from "@/components/ui/input/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import { IconCheckbox, IconChevronLeft, IconSend } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { INewPassword } from "@/interfaces/reset-password.interface";
import resetPassword from "@/app/actions/auth/resetPassword";
import { useTranslations } from "next-intl";

interface IProps {
  resetToken: string;
}

const ResetPassword: FC<IProps> = ({ resetToken }) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
  } = useForm<INewPassword>();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: INewPassword) => {
    setIsLoading(true);

    const { responseData, error } = await resetPassword({
      ...data,
      resetToken,
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
      title: responseData?.message,
      description: t("youCanNowSignIn"),
      action: <IconCheckbox className="w-6 h-6" color="#86EFAC" />,
    });

    setIsLoading(false);
    router.push("/auth/sign-in");
  };

  return (
    <form
      className="h-full flex flex-col justify-center px-2 md:px-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fade direction="up" duration={300} cascade>
        <h2 className="text-2xl font-bold dark:text-zinc-50">
          {t("setNewPassword")}
        </h2>

        <p className="text-sm text-gray-700 mt-2 mb-5 dark:text-zinc-50">
          {t("createYourNewAccessPassword")}
        </p>

        <Controller
          control={control}
          defaultValue=""
          name="password"
          rules={{
            required: { value: true, message: t("utils.requiredField") },
            pattern: {
              value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g,
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

        <div className="flex flex-col gap-4 sm:flex-row">
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
            text={t("utils.send")}
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

export default ResetPassword;
