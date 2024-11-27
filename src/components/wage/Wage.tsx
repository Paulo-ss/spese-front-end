"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { IWage } from "@/interfaces/wage.interface";
import { FC, useState } from "react";
import Card from "../ui/card/Card";
import {
  IconCash,
  IconCheckbox,
  IconEdit,
  IconSend2,
  IconX,
} from "@tabler/icons-react";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { Fade } from "react-awesome-reveal";
import IconButton from "../ui/button/IconButton";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import Input from "../ui/input/Input";
import { theme } from "@/lib/theme/theme";
import editWage from "@/app/actions/wage/editWage";

interface IProps {
  wage?: IWage;
  error?: IAPIError;
  locale: string;
}

const Wage: FC<IProps> = ({ wage, error, locale }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<{ wage: string }>();
  const t = useTranslations();
  const { toast } = useToast();

  const onSubmit = async (data: { wage: string }) => {
    try {
      setIsLoading(true);

      const { error } = await editWage(data.wage.replace(",", "."));

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
          variant: "destructive",
        });

        return;
      }

      setIsEditing(false);

      toast({
        title: t("utils.success"),
        description: t("wageUpdated"),
        action: (
          <IconCheckbox className="w-6 h-6" color={theme.colors.emerald[400]} />
        ),
      });
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      title={"yourWage"}
      icon={<IconCash />}
      action={
        <div className="flex items-center gap-2">
          {isEditing ? (
            <IconButton
              type="button"
              color="error"
              icon={<IconX />}
              onClick={() => setIsEditing(false)}
            />
          ) : (
            <IconButton
              type="button"
              color="info"
              icon={<IconEdit />}
              onClick={() => {
                setIsEditing(true);
                setValue("wage", String(wage?.wage));
              }}
            />
          )}
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isEditing ? (
              <div className="flex flex-col w-full sm:max-w-64">
                <Controller
                  control={control}
                  name="wage"
                  defaultValue="0"
                  rules={{
                    validate: (wage) => {
                      if (
                        isNaN(Number(wage.replace(",", "."))) ||
                        wage.length === 0 ||
                        Number(wage) === 0
                      ) {
                        return t("wageValidations.typeAValidWage");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      label={t("typeYourWage")}
                      {...field}
                      error={!!errors.wage?.message}
                      helperText={errors.wage?.message}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="grow flex flex-col gap-2">
                <p className="text-base">{t("yourWage")}</p>

                <p className="text-2xl font-bold">
                  {Number(wage?.wage).toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>
            )}

            {isEditing && (
              <div className="mt-6 py-4 flex gap-2 justify-end border-t border-gray-100 dark:border-zinc-600">
                <IconButton
                  type="submit"
                  icon={<IconSend2 width={30} height={30} />}
                  color="primary"
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </div>
            )}
          </form>
        </Fade>
      )}
    </Card>
  );
};

export default Wage;
