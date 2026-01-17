"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import Input from "@/components/ui/input/Input";

import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconCheckbox,
  IconChevronLeft,
  IconEdit,
  IconPlus,
  IconSend2,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IIncome, IIncomeForm } from "@/interfaces/income.interface";
import editIncome from "@/app/actions/incomes/editIncome";
import saveIncome from "@/app/actions/incomes/saveIncome";
import DatePicker from "@/components/ui/datePicker/DatePicker";
import { theme } from "@/lib/theme/theme";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import { fetchResource } from "@/services/fetchService";
import Label from "@/components/ui/label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/Select";
import Image from "next/image";

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
  const { bankAccountId } = useWatch({ control });

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);

  const fetchBankAccounts = useCallback(async () => {
    try {
      const { data, error } = await fetchResource<IBankAccount[]>({
        url: "/bank-account/all/user",
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setBankAccounts(data!);
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
          variant: "destructive",
        });
      }
    }
  }, [t, toast]);

  const onSubmit = async (data: IIncomeForm) => {
    try {
      setIsLoading(true);

      const formData: IIncomeForm = {
        ...data,
      };

      const { error } = income
        ? await editIncome(formData, income.id)
        : await saveIncome(formData);

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

      toast({
        title: t("utils.success"),
        description: income
          ? t("incomes.successfullUpdate")
          : t("incomes.successfullCreated"),
        action: (
          <IconCheckbox className="w-6 h-6" color={theme.colors.emerald[400]} />
        ),
      });

      router.push("/incomes");
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
      setValue("bankAccountId", income.bankAccount?.id);
    }

    fetchBankAccounts();
  }, [income, setValue, fetchBankAccounts]);

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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <Controller
                  control={control}
                  name={`name`}
                  defaultValue=""
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

              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <Controller
                  control={control}
                  name={`value`}
                  defaultValue={0}
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

              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <Controller
                  control={control}
                  name={`date`}
                  defaultValue={new Date()}
                  disabled={!!income}
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      value={value}
                      label="incomes.date"
                      onChange={onChange}
                      error={!!errors?.date?.message}
                      helperText={errors.date?.message}
                      locale={locale}
                      disabled={!!income}
                    />
                  )}
                />
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <Controller
                  control={control}
                  name="bankAccountId"
                  defaultValue={
                    income && income.bankAccount
                      ? income.bankAccount.id
                      : undefined
                  }
                  render={({ field: { value, onChange, name } }) => (
                    <Fragment>
                      <div className="mb-2">
                        <Label name={name} label={t("expenses.bankAccount")} />
                      </div>

                      <Select
                        onValueChange={onChange}
                        value={String(value)}
                        name={name}
                        disabled={!!income}
                      >
                        <div className="flex justify-between items-center w-full gap-2">
                          <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                            <SelectValue></SelectValue>
                          </SelectTrigger>

                          {bankAccountId && !income && (
                            <div
                              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                              onClick={() =>
                                setValue("bankAccountId", undefined)
                              }
                            >
                              <IconX className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <SelectContent>
                          {bankAccounts.map((bankAccount) => (
                            <SelectItem
                              key={bankAccount.id}
                              value={String(bankAccount.id)}
                            >
                              <div className="p-2 flex rounded-md flex-row items-center gap-2">
                                <Image
                                  src={`/images/logos/${bankAccount.bank}.png`}
                                  width={512}
                                  height={512}
                                  alt={`${bankAccount.bank} logo`}
                                  className="w-6 h-6 rounded-full"
                                />

                                <p>{bankAccount.bank}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Fragment>
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
