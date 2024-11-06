"use client";

import Input from "@/components/ui/input/Input";
import { ISignIn } from "@/interfaces/sign-in.interface";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import GoogleSvg from "/public/images/logos/google-logo.svg";
import Divider from "@/components/ui/divider/Divider";
import Button from "@/components/ui/button/Button";
import { IconLogin } from "@tabler/icons-react";
import signIn from "@/app/actions/auth/signIn";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { externalOAuth2SignIn } from "@/app/actions/auth/externalOAuth2SignIn";
import { Fade } from "react-awesome-reveal";
import { useTranslations } from "next-intl";
import { setLanguage } from "@/app/actions/cookies/setLanguage";

const SignInForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<ISignIn>();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const onSubmit = async (data: ISignIn) => {
    try {
      setIsLoading(true);

      const result = await signIn(data);

      if (result?.errorMessage) {
        toast({
          title: t("utils.error"),
          description: result.errorMessage,
          variant: "destructive",
        });

        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalOAuth2SignIn = useCallback(async () => {
    const result = await externalOAuth2SignIn(params.get("code")!);

    if (result?.errorMessage) {
      toast({ title: t("utils.error"), description: result.errorMessage });
      return;
    }

    router.push("/");
  }, [params]);

  useEffect(() => {
    if (params.has("code")) {
      handleExternalOAuth2SignIn();
    }

    if (params.has("error")) {
      toast({ title: t("utils.error"), description: params.get("error") });
    }
  }, [params, handleExternalOAuth2SignIn]);

  return (
    <form
      className="h-full flex flex-col justify-center px-2 md:px-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fade direction="up" duration={300} cascade>
        <h2 className="text-2xl font-bold mb-3 dark:text-emerald-50">
          {t("signin")} {t("utils.with")}
        </h2>

        <Link
          href={`https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPES}`}
          className="w-full max-w-40 mb-3 flex justify-start"
        >
          <button
            type="button"
            className="w-full max-w-40 flex justify-center border border-gray-100 rounded-md py-4 px-2 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300 dark:text-zinc-50 dark:border-zinc-50 dark:hover:bg-zinc-950"
          >
            <Image src={GoogleSvg} width={20} height={20} alt="google's logo" />

            <p className="text-sm ml-2">Google</p>
          </button>
        </Link>

        <Divider text={t("utils.or")} />

        <Controller
          control={control}
          name="emailOrUsername"
          rules={{
            required: { value: true, message: t("utils.requiredField") },
            validate: (value) => {
              if (!value.includes(".")) {
                return t("validationMessages.typeAValidUsername");
              }

              if (
                value.includes("@") &&
                !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
              ) {
                return t("validationMessages.typeAValidEmail", {
                  ns: "auth",
                });
              }
            },
          }}
          render={({ field }) => (
            <Input
              type="text"
              label={`${t("utils.email")} ${t("utils.or")} ${t("username", {
                ns: "auth",
              })}`}
              {...field}
              error={!!errors.emailOrUsername?.message}
              helperText={errors.emailOrUsername?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: { value: true, message: t("utils.requiredField") },
          }}
          render={({ field }) => (
            <Input
              type="password"
              label={t("password", { ns: "auth" })}
              {...field}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
          )}
        />

        <Button
          type="submit"
          text={t("utils.signIn")}
          color="primary"
          trailing={<IconLogin />}
          disabled={isLoading}
          isLoading={isLoading}
        />

        <span className="flex mt-8">
          <p className="text-black dark:text-zinc-50 italic">
            {t("notRegistered", { ns: "auth" })}?
          </p>

          <Link href="/auth/sign-up">
            <p className="underline italic text-blue-400 ml-1">
              {t("createAccount", { ns: "auth" })}
            </p>
          </Link>
        </span>

        <span className="flex mt-2">
          <p className="text-black dark:text-zinc-50 italic">
            {t("forgotPassword", { ns: "auth" })}?
          </p>

          <Link href="/auth/reset-password">
            <p className="underline italic text-blue-400 ml-1">
              {t("clickHere", { ns: "auth" })}
            </p>
          </Link>
        </span>
      </Fade>
    </form>
  );
};

export default SignInForm;
