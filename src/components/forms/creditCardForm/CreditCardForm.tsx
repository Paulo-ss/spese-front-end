"use client";

import editCreditCard from "@/app/actions/creditCard/editCreditCard";
import saveMultipleCreditCards from "@/app/actions/creditCard/saveMultipleCreditCards";
import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Input from "@/components/ui/input/Input";
import Label from "@/components/ui/label/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/Select";
import { Banks } from "@/enums/banks.enum";
import { InvoiceStatus } from "@/enums/invoice.enum";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import {
  ICreditCard,
  ICreditCardsForm,
} from "@/interfaces/credit-card.interface";
import { fetchResource } from "@/services/fetchService";
import { banksSelectOptions } from "@/utils/bankAccounts/bankAccountsSelectOptions";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconChevronLeft,
  IconCreditCard,
  IconEdit,
  IconPlus,
  IconSend,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

interface IProps {
  creditCard?: ICreditCard;
  error?: IAPIError;
  updateIsEditing?: (isEditing: boolean) => void;
}

const daysOfTheMonth = Array.from({ length: 31 }, (_, i) => i + 1);

const CreditCardForm: FC<IProps> = ({ updateIsEditing, creditCard, error }) => {
  const shouldDisableClosingAndDueDay =
    creditCard && creditCard.invoices && creditCard.invoices?.length > 0
      ? !creditCard.invoices!.some(
          ({ status }) => status === InvoiceStatus.OPENED_FUTURE
        )
      : true;

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = useForm<ICreditCardsForm>({
    defaultValues: {
      creditCards: [
        {
          bank: Banks.NUBANK,
          closingDay: 1,
          dueDay: 1,
          limit: 0,
          nickname: "",
        },
      ],
    },
  });
  const { fields, append, remove, update } = useFieldArray<ICreditCardsForm>({
    control,
    name: "creditCards",
  });
  const { creditCards } = useWatch({ control });
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

  const onSubmit = async (data: ICreditCardsForm) => {
    try {
      setIsLoading(true);

      const { error } = creditCard
        ? await editCreditCard(data.creditCards[0])
        : await saveMultipleCreditCards(data.creditCards);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });
      }

      if (creditCard && updateIsEditing) {
        updateIsEditing(false);

        return;
      }

      router.push("/credit-cards");
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
    if (creditCard) {
      update(0, {
        id: creditCard.id,
        bank: creditCard.bank,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
        limit: creditCard.limit,
        nickname: creditCard.nickname,
        lastFourDigits: creditCard.lastFourDigits,
      });
    }

    fetchBankAccounts();
  }, [creditCard, update, fetchBankAccounts]);

  const FormContent = (
    <Fragment>
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2 flex flex-col gap-4 px-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col items-end border border-zinc-300 dark:border-zinc-600 rounded-md p-4 mt-2"
                >
                  <div className="mb-2 w-full flex flex-row justify-between items-center">
                    <IconCreditCard />

                    {!creditCard && (
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
                        name={`creditCards.${index}.nickname`}
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
                            label={t("creditCard.nickname")}
                            name={name}
                            value={value}
                            onChange={onChange}
                            error={
                              errors?.creditCards &&
                              !!errors?.creditCards[index]?.nickname?.message
                            }
                            helperText={
                              errors?.creditCards &&
                              errors?.creditCards[index]?.nickname?.message
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <Controller
                        control={control}
                        name={`creditCards.${index}.bank`}
                        defaultValue={Banks.NUBANK}
                        render={({ field: { value, onChange, name } }) => (
                          <Fragment>
                            <div className="mb-2">
                              <Label
                                name={name}
                                label={t("bankAccount.selectTheBank")}
                              />
                            </div>

                            <Select
                              onValueChange={onChange}
                              defaultValue={value}
                              value={value}
                              name={name}
                            >
                              <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                <SelectValue placeholder={Banks.NUBANK} />
                              </SelectTrigger>

                              <SelectContent>
                                {banksSelectOptions.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    <div className="p-2 flex rounded-md flex-row items-center gap-2">
                                      <div className="w-6 h-6">
                                        <Image
                                          src={`/images/logos/${value}.png`}
                                          width={512}
                                          height={512}
                                          alt={`${value} logo`}
                                        />
                                      </div>

                                      <p>{label}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Fragment>
                        )}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <Controller
                        control={control}
                        name={`creditCards.${index}.limit`}
                        defaultValue={0}
                        rules={{
                          required: {
                            value: true,
                            message: t("utils.requiredField"),
                          },
                          validate: (value) => {
                            if (value <= 0) {
                              return t(
                                "commonValidations.mustBeGreaterThanZero"
                              );
                            }
                          },
                        }}
                        render={({ field: { value, onChange, name } }) => (
                          <Input
                            type="text"
                            label={t("creditCard.typeTheLimit")}
                            name={name}
                            value={value}
                            onChange={onChange}
                            onBlur={() => {
                              formatDecimalNumber({
                                value,
                                setFieldValue: (formattedValue: number) => {
                                  const formData = getValues("creditCards");
                                  const creditCard = formData[index];

                                  update(index, {
                                    ...creditCard,
                                    limit: formattedValue,
                                  });
                                },
                              });
                            }}
                            error={
                              errors?.creditCards &&
                              !!errors?.creditCards[index]?.limit?.message
                            }
                            helperText={
                              errors?.creditCards &&
                              errors?.creditCards[index]?.limit?.message
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <Controller
                        control={control}
                        name={`creditCards.${index}.closingDay`}
                        defaultValue={1}
                        render={({ field: { value, onChange, name } }) => (
                          <Fragment>
                            <div className="mb-2">
                              <Label
                                name={name}
                                label={t("creditCard.closingDay")}
                              />
                            </div>

                            <Select
                              onValueChange={onChange}
                              defaultValue={String(value)}
                              value={String(value)}
                              name={name}
                              disabled={!shouldDisableClosingAndDueDay}
                            >
                              <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>
                                    {t("utils.daysOfTheMonth")}
                                  </SelectLabel>
                                  {daysOfTheMonth.map((day) => (
                                    <SelectItem key={day} value={String(day)}>
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
                        name={`creditCards.${index}.dueDay`}
                        defaultValue={1}
                        render={({ field: { value, onChange, name } }) => (
                          <Fragment>
                            <div className="mb-2">
                              <Label
                                name={name}
                                label={t("creditCard.dueDay")}
                              />
                            </div>

                            <Select
                              onValueChange={onChange}
                              defaultValue={String(value)}
                              value={String(value)}
                              name={name}
                              disabled={!shouldDisableClosingAndDueDay}
                            >
                              <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>
                                    {t("utils.daysOfTheMonth")}
                                  </SelectLabel>
                                  {daysOfTheMonth.map((day) => (
                                    <SelectItem key={day} value={String(day)}>
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
                        name={`creditCards.${index}.bankAccountId`}
                        defaultValue={
                          creditCard && creditCard.bankAccount
                            ? creditCard.bankAccount.id
                            : undefined
                        }
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
                              disabled={!!creditCard}
                            >
                              <div className="flex justify-between items-center w-full gap-2">
                                <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                  <SelectValue></SelectValue>
                                </SelectTrigger>

                                {creditCards &&
                                  creditCards[index] &&
                                  creditCards[index].bankAccountId &&
                                  !creditCard && (
                                    <div
                                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                      onClick={() =>
                                        setValue(
                                          `creditCards.${index}.bankAccountId`,
                                          null
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

                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <Controller
                        control={control}
                        name={`creditCards.${index}.lastFourDigits`}
                        defaultValue=""
                        render={({ field: { name, ...fileldProps } }) => (
                          <Fragment>
                            <div className="mb-2">
                              <Label
                                name={name}
                                label={t("creditCard.lastFourDigits")}
                              />
                            </div>

                            <InputOTP
                              maxLength={4}
                              name={name}
                              {...fileldProps}
                              pattern={REGEXP_ONLY_DIGITS}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                              </InputOTPGroup>
                            </InputOTP>
                          </Fragment>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!creditCard && (
              <div className="mt-2 p-6">
                <IconButton
                  type="button"
                  icon={<IconPlus />}
                  color="primary"
                  onClick={() =>
                    append({
                      id: 0,
                      bank: Banks.NUBANK,
                      limit: 0,
                      nickname: "",
                      dueDay: 1,
                      closingDay: 1,
                      lastFourDigits: "",
                      bankAccountId: undefined,
                    })
                  }
                />
              </div>
            )}

            <div className="mt-2 p-6 flex gap-2 justify-end">
              <IconButton
                type="submit"
                icon={<IconSend />}
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </form>
        </Fade>
      )}
    </Fragment>
  );

  if (creditCard) {
    return FormContent;
  }

  return (
    <Card
      title={
        creditCard
          ? "creditCard.editCreditCard"
          : "creditCard.registerYourCards"
      }
      icon={creditCard ? <IconEdit /> : <IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/credit-cards")}
          />
        </div>
      }
    >
      {FormContent}
    </Card>
  );
};

export default CreditCardForm;
