"use client";

import editWage from "@/app/actions/wage/editWage";
import saveMultipleWages from "@/app/actions/wage/saveMultipleWages";
import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import Input from "@/components/ui/input/Input";
import Label from "@/components/ui/label/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/Select";
import { WageBusinessDay } from "@/enums/wage.enum";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import { IWage, IWagesForm } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconChevronLeft,
  IconCoin,
  IconEdit,
  IconPlus,
  IconQuestionMark,
  IconSend2,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Slide } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

interface IProps {
  wage?: IWage;
  error?: IAPIError;
  updateIsEditing?: (isEditing: boolean) => void;
}

const daysOfTheMonth = Array.from({ length: 31 }, (_, i) => i + 1);

const WageForm: FC<IProps> = ({ wage, error, updateIsEditing }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IWagesForm>({
    defaultValues: {
      wages: [
        {
          paymentDay: 1,
          wage: 0,
          bankAccountId: undefined,
          businessDay: WageBusinessDay.BEFORE,
        },
      ],
    },
  });
  const { fields, append, remove, update } = useFieldArray<IWagesForm>({
    control,
    name: "wages",
  });
  const { wages } = useWatch({ control });
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();

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

  const onSubmit = async (data: IWagesForm) => {
    try {
      setIsLoading(true);

      const { error } = wage
        ? await editWage(data.wages[0], wage.id)
        : await saveMultipleWages(data.wages);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });
      }

      if (wage && updateIsEditing) {
        updateIsEditing(false);

        return;
      }

      router.push("/wage");
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wage) {
      update(0, {
        wage: wage.wage,
        businessDay: wage.businessDay,
        paymentDay: wage.paymentDay,
        bankAccountId: wage.bankAccount?.id,
      });
    }
  }, [wage, update]);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const FormContent = (
    <Fragment>
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Slide duration={300} direction="right" triggerOnce>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2 flex flex-col gap-4 px-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col items-end border-b border-zinc-300 dark:border-zinc-600 pb-5 mt-2"
                >
                  <div className="mb-2 w-full flex flex-row justify-between items-center">
                    <IconCoin />

                    {!wage && (
                      <IconButton
                        type="button"
                        icon={<IconTrash width={25} height={25} />}
                        color="error"
                        onClick={() => remove(index)}
                      />
                    )}
                  </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <Controller
                        control={control}
                        name={`wages.${index}.wage`}
                        defaultValue={0}
                        rules={{
                          required: {
                            value: true,
                            message: t("utils.requiredField"),
                          },
                          validate: (value) => {
                            if (value && value <= 0) {
                              return t(
                                "commonValidations.mustBeGreaterThanZero"
                              );
                            }
                          },
                        }}
                        render={({ field: { value, onChange, name } }) => (
                          <Input
                            type="text"
                            label={t("typeYourWage")}
                            name={name}
                            value={value}
                            onChange={onChange}
                            onBlur={() => {
                              if (value) {
                                formatDecimalNumber({
                                  value,
                                  setFieldValue: (formattedValue: number) => {
                                    setValue(
                                      `wages.${index}.wage`,
                                      formattedValue
                                    );
                                  },
                                });
                              }
                            }}
                            error={
                              errors?.wages &&
                              !!errors?.wages[index]?.wage?.message
                            }
                            helperText={
                              errors?.wages &&
                              errors?.wages[index]?.wage?.message
                            }
                          />
                        )}
                      />
                    </div>

                    {!wage && (
                      <Fragment>
                        <div className="col-span-12 sm:col-span-6 md:col-span-4">
                          <Controller
                            control={control}
                            name={`wages.${index}.paymentDay`}
                            defaultValue={1}
                            render={({ field: { value, onChange, name } }) => (
                              <Fragment>
                                <div className="flex items-center gap-2 mb-2">
                                  <label
                                    className="text-black dark:text-zinc-50"
                                    htmlFor={name}
                                  >
                                    {t("paymentDay")}
                                  </label>

                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-950 text-zinc-50 dark:bg-white dark:text-zinc-950 shadow-md cursor-pointer">
                                        <IconQuestionMark />
                                      </span>
                                    </PopoverTrigger>

                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <div className="italic p-2 text-sm">
                                        {t("infoPaymentDay")}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                <Select
                                  onValueChange={onChange}
                                  defaultValue={String(value)}
                                  value={String(value)}
                                  name={name}
                                >
                                  <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                    <SelectValue />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectGroup>
                                      {daysOfTheMonth.map((day) => (
                                        <SelectItem
                                          key={day}
                                          value={String(day)}
                                        >
                                          {day}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </Fragment>
                            )}
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-6 md:col-span-4">
                          <Controller
                            control={control}
                            name={`wages.${index}.businessDay`}
                            defaultValue={WageBusinessDay.BEFORE}
                            render={({ field: { value, onChange, name } }) => (
                              <Fragment>
                                <div className="flex items-center gap-2 mb-2">
                                  <label
                                    className="text-black dark:text-zinc-50"
                                    htmlFor={name}
                                  >
                                    {t("businessDay")}
                                  </label>

                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-950 text-zinc-50 dark:bg-white dark:text-zinc-950 shadow-md cursor-pointer">
                                        <IconQuestionMark />
                                      </span>
                                    </PopoverTrigger>

                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <div className="italic p-2 text-sm">
                                        {t("infoBusinessDay")}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                <Select
                                  onValueChange={onChange}
                                  defaultValue={String(value)}
                                  value={String(value)}
                                  name={name}
                                >
                                  <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                    <SelectValue />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem
                                        key={WageBusinessDay.BEFORE}
                                        value={WageBusinessDay.BEFORE}
                                      >
                                        {t(`${WageBusinessDay.BEFORE}`)}
                                      </SelectItem>
                                      <SelectItem
                                        key={WageBusinessDay.AFTER}
                                        value={WageBusinessDay.AFTER}
                                      >
                                        {t(`${WageBusinessDay.AFTER}`)}
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </Fragment>
                            )}
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-6 md:col-span-4">
                          <Controller
                            control={control}
                            name={`wages.${index}.bankAccountId`}
                            render={({ field: { value, onChange, name } }) => (
                              <Fragment>
                                <div className="mb-2">
                                  <Label
                                    name={name}
                                    label={t("expenses.bankAccount")}
                                  />
                                </div>

                                <Select
                                  onValueChange={onChange}
                                  value={String(value)}
                                  name={name}
                                >
                                  <div className="flex justify-between items-center w-full gap-2">
                                    <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                      <SelectValue></SelectValue>
                                    </SelectTrigger>

                                    {wages && wages[index]?.bankAccountId && (
                                      <div
                                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                        onClick={() =>
                                          setValue(
                                            `wages.${index}.bankAccountId`,
                                            undefined
                                          )
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
                      </Fragment>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!wage && (
              <div className="mt-2 p-6">
                <IconButton
                  type="button"
                  icon={<IconPlus />}
                  color="primary"
                  onClick={() =>
                    append({
                      wage: 0,
                      paymentDay: 1,
                      bankAccountId: undefined,
                      businessDay: WageBusinessDay.BEFORE,
                    })
                  }
                />
              </div>
            )}

            <div className="mt-2 p-6 flex gap-2 justify-end">
              <IconButton
                type="submit"
                icon={<IconSend2 />}
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </form>
        </Slide>
      )}
    </Fragment>
  );

  if (wage) {
    return FormContent;
  }

  return (
    <Card
      title={wage ? "editYourWage" : "createNewWages"}
      icon={wage ? <IconEdit /> : <IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/wage")}
          />
        </div>
      }
    >
      {FormContent}
    </Card>
  );
};

export default WageForm;
