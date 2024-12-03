"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import Input from "@/components/ui/input/Input";

import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconAlertTriangle,
  IconCheckbox,
  IconChevronLeft,
  IconEdit,
  IconPlus,
  IconSend2,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { FC, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import { IIncome, IIncomeForm } from "@/interfaces/income.interface";
import editIncome from "@/app/actions/incomes/editIncome";
import saveIncome from "@/app/actions/incomes/saveIncome";
import DatePicker from "@/components/ui/datePicker/DatePicker";
import { theme } from "@/lib/theme/theme";

interface IProps {
  income?: IIncome;
  error?: IAPIError;
  locale: string;
}

const IncomesForm: FC<IProps> = ({ income, error, locale }) => {
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<IIncomeForm>();

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: IIncomeForm) => {
    try {
      setIsLoading(true);

      const { error } = income
        ? await editIncome(data, income.id)
        : await saveIncome(data);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
          variant: "destructive",
          action: <IconAlertTriangle />,
        });

        return;
      }

      if (!income) {
        router.push("/incomes");

        return;
      }

      toast({
        title: t("utils.error"),
        description: t("incomes.successfullUpdate"),
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

  useEffect(() => {
    if (income) {
      const [year, month, day] = income.incomeMonth.split("-").map(Number);

      setValue("name", income.name);
      setValue(
        "value",
        Number(formatDecimalNumber({ value: income.value, returnValue: true }))
      );
      setValue("date", new Date(year, month - 1, day));
    }
  }, [income, setValue]);

  return (
    <Card
      title={income ? "incomes.editIncome" : "incomes.newIncome"}
      icon={income ? <IconEdit /> : <IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/incomes")}
          />
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name={`name`}
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange, name } }) => (
                    <Input
                      type="text"
                      label={t("utils.name")}
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={errors && !!errors.name?.message}
                      helperText={errors?.name?.message}
                    />
                  )}
                />
              </div>

              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name={`value`}
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange, name } }) => (
                    <Input
                      type="text"
                      label={t("utils.price")}
                      name={name}
                      value={value}
                      onChange={onChange}
                      onBlur={() => {
                        formatDecimalNumber({
                          value,
                          setFieldValue: (formattedValue: number) => {
                            setValue("value", formattedValue);
                          },
                        });
                      }}
                      error={errors && !!errors.value?.message}
                      helperText={errors?.value?.message}
                    />
                  )}
                />
              </div>

              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name={`date`}
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      error={!!errors?.date?.message}
                      helperText={errors.date?.message}
                      locale={locale}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <IconButton
                type="submit"
                icon={<IconSend2 />}
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </form>
        </Fade>
      )}
    </Card>
  );
};

export default IncomesForm;
