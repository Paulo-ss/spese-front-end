"use client";

import editBankAccount from "@/app/actions/bankAccount/editBankAccount";
import saveMultipleBankAccounts from "@/app/actions/bankAccount/saveMultipleBankAccounts";
import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import Input from "@/components/ui/input/Input";
import Label from "@/components/ui/label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/Select";
import { Banks } from "@/enums/banks.enum";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import {
  IBankAccount,
  IBankAccountFieldsArray,
} from "@/interfaces/bank-account.interface";
import { banksSelectOptions } from "@/utils/bankAccounts/bankAccountsSelectOptions";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconChevronLeft,
  IconEdit,
  IconPlus,
  IconSend2,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, Fragment, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm } from "react-hook-form";

interface IProps {
  bankAccount?: IBankAccount;
  error?: IAPIError;
}

const BankAccountForm: FC<IProps> = ({ bankAccount, error }) => {
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<IBankAccountFieldsArray>({
    defaultValues: {
      bankAccounts: [{ bank: Banks.NUBANK, currentBalance: 0 }],
    },
  });
  const { fields, append, remove, update } =
    useFieldArray<IBankAccountFieldsArray>({
      control,
      name: "bankAccounts",
    });

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: IBankAccountFieldsArray) => {
    try {
      setIsLoading(true);

      const { error } = bankAccount
        ? await editBankAccount(bankAccount.id, data.bankAccounts[0])
        : await saveMultipleBankAccounts(data.bankAccounts);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });
      }

      router.push("/bank-accounts");
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
    if (bankAccount) {
      update(0, {
        bank: bankAccount.bank,
        currentBalance: bankAccount.currentBalance!,
      });
    }
  }, [bankAccount, update]);

  return (
    <Card
      title={
        bankAccount
          ? "bankAccount.editBankAccount"
          : "bankAccount.registerYourBankAccount"
      }
      icon={bankAccount ? <IconEdit /> : <IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/bank-accounts")}
          />
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2 flex flex-col gap-4 px-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4"
                >
                  <div className="grow w-full md:w-auto">
                    <Controller
                      control={control}
                      name={`bankAccounts.${index}.bank`}
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
                            disabled={!!bankAccount}
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

                  <div className="grow w-full md:w-auto">
                    <Controller
                      control={control}
                      name={`bankAccounts.${index}.currentBalance`}
                      render={({ field: { value, onChange, name } }) => (
                        <Input
                          type="text"
                          label={t("bankAccount.typeTheCurrentBalance")}
                          name={name}
                          value={value}
                          onChange={onChange}
                          onBlur={() => {
                            formatDecimalNumber({
                              value,
                              setFieldValue: (formattedValue: number) => {
                                const options = getValues(`bankAccounts`);
                                const bank = options[index].bank;

                                update(index, {
                                  bank,
                                  currentBalance: formattedValue,
                                });
                              },
                            });
                          }}
                          error={
                            errors?.bankAccounts &&
                            !!errors?.bankAccounts[index]?.currentBalance
                              ?.message
                          }
                          helperText={
                            errors?.bankAccounts &&
                            errors?.bankAccounts[index]?.currentBalance?.message
                          }
                        />
                      )}
                    />
                  </div>

                  {!bankAccount && (
                    <div className="grow w-full md:grow-0 md:w-fit">
                      <IconButton
                        type="button"
                        icon={<IconTrash width={30} height={30} />}
                        color="error"
                        fullWidth
                        onClick={() => remove(index)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!bankAccount && (
              <div className="mt-2 p-6">
                <IconButton
                  type="button"
                  icon={<IconPlus width={30} height={30} />}
                  color="primary"
                  onClick={() =>
                    append({ bank: Banks.NUBANK, currentBalance: 0 })
                  }
                />
              </div>
            )}

            <div
              className={`${
                bankAccount ? "mt-6" : "mt-2"
              } p-6 flex gap-2 justify-end border-t border-gray-100 dark:border-zinc-600`}
            >
              <IconButton
                type="submit"
                icon={<IconSend2 width={30} height={30} />}
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

export default BankAccountForm;