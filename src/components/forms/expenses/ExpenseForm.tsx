"use client";

import createExpense from "@/app/actions/expenses/createExpense";
import editExpense from "@/app/actions/expenses/editExpense";
import DatePicker from "@/components/ui/datePicker/DatePicker";
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
import { ExpenseCategory, ExpenseType } from "@/enums/expenses.enum";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import { CategoryKey, ICategory } from "@/interfaces/category.interface";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import {
  ExpenseFormKeys,
  IExpense,
  IExpenseForm,
} from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconChevronLeft,
  IconPlus,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Locale } from "@/types/locale.type";
import { categories } from "@/utils/category/categoriesLangIcon";

interface IProps {
  locale: string;
  expense?: IExpense;
  error?: IAPIError;
  updateIsEditing?: (isEditing: boolean) => void;
}

const ExpenseForm: FC<IProps> = ({
  locale,
  expense,
  error,
  updateIsEditing,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm<IExpenseForm>({
    defaultValues: {
      name: "",
      price: 0,
      bankAccountId: null,
      creditCardId: null,
      category: ExpenseCategory.NA,
      customCategory: null,
      expenseDate: new Date(),
      expenseType: null,
      installments: null,
    },
  });
  const { bankAccountId, creditCardId, installments, expenseType } =
    useWatch<IExpenseForm>({
      control,
    });

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
  const [customCategories, setCustomCategories] = useState<ICategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);

  const onSubmit = async (data: IExpenseForm) => {
    try {
      setIsLoading(true);

      for (const key in data) {
        if (
          data[key as ExpenseFormKeys] === null ||
          data[key as ExpenseFormKeys] === undefined
        ) {
          delete data[key as ExpenseFormKeys];
        }
      }

      const { error } = expense
        ? await editExpense(expense.id, {
            ...data,
            bankAccountId: expense.bankAccount?.id,
            creditCardId: expense.creditCard?.id,
            category: data.category ?? expense.category,
            customCategory:
              Number(data.customCategory) ?? expense.customCategory?.id,
            expenseType: expense.expenseType,
            installments: expense.totalInstallments,
          })
        : await createExpense(data);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });

        return;
      }

      if (expense && updateIsEditing) {
        updateIsEditing(false);

        return;
      }

      router.push("/expenses");
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

  const fetchCreditCards = useCallback(async () => {
    try {
      const { data: creditCards, error } = await fetchResource<ICreditCard[]>({
        url: `/credit-card/all/user`,
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setCreditCards(creditCards!);
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

  const fetchCustomCategories = useCallback(async () => {
    try {
      const { data: customCategories, error } = await fetchResource<
        ICategory[]
      >({
        url: `/category/all/user`,
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setCustomCategories(customCategories!);
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

  const fetchBankAccounts = useCallback(async () => {
    try {
      const { data, error } = await fetchResource<IBankAccount[]>({
        url: "/bank-account/all/user",
        config: { options: { next: { tags: ["bank-accounts"] } } },
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

  useEffect(() => {
    if (expense) {
      const englishCategory = Object.keys(categories).find((categoryKey) => {
        const category = categories[categoryKey as CategoryKey];

        return category.lang.pt === expense.category;
      });

      setValue("name", expense.name);
      setValue("price", Number(expense.price));
      setValue(
        "category",
        expense
          ? expense.customCategory
            ? null
            : ExpenseCategory[englishCategory! as CategoryKey]
          : ExpenseCategory.NA
      );
      setValue("customCategory", expense.customCategory?.id);
    }
  }, [expense, setValue]);

  useEffect(() => {
    if (!expense) {
      fetchCreditCards();
      fetchBankAccounts();
    }

    fetchCustomCategories();
  }, [fetchCreditCards, fetchCustomCategories, fetchBankAccounts, expense]);

  const FormContent = (
    <Fragment>
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="font-bold italic text-2xl">
                {t("expenses.overallInfo")}
              </h3>

              <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name="name"
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
                        label={t("expenses.name")}
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={errors?.name && !!errors?.name?.message}
                        helperText={errors?.name && errors?.name?.message}
                      />
                    )}
                  />
                </div>

                {!expense && (
                  <div className="col-span-12 sm:col-span-6 flex flex-col gap-4">
                    <p>{t("expenses.type")}</p>

                    <Controller
                      control={control}
                      name="expenseType"
                      rules={{
                        required: {
                          value: true,
                          message: t("expenses.selectAType"),
                        },
                      }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <div className="flex gap-2 items-center">
                            <div className="cursor-pointer">
                              <input
                                className="hidden"
                                type="checkbox"
                                checked={
                                  value ? value! === ExpenseType.DEBIT : false
                                }
                                id="debit-checkbox"
                                name="debit-checkbox"
                                value={ExpenseType.DEBIT}
                                onChange={(event) => {
                                  if (expense) {
                                    return;
                                  }

                                  if (value && value === ExpenseType.DEBIT) {
                                    onChange(null);

                                    return;
                                  }

                                  onChange(event.target.value);
                                }}
                                disabled={!!expense}
                              />

                              <label
                                htmlFor="debit-checkbox"
                                className={`p-2 md:py-2 md:px-4 rounded-2xl font-bold border border-emerald-300 dark:border-emerald-600   ${
                                  value && value === ExpenseType.DEBIT
                                    ? "bg-emerald-300 dark:bg-emerald-600 dar:text-zinc-50"
                                    : ""
                                } transition-colors cursor-pointer`}
                                aria-disabled={!!expense}
                              >
                                {t("expenses.debit")}
                              </label>
                            </div>

                            <div className="cursor-pointer">
                              <input
                                className="hidden"
                                type="checkbox"
                                checked={
                                  value
                                    ? value! === ExpenseType.CREDIT_CARD
                                    : false
                                }
                                id="credit-checkbox"
                                name="credit-checkbox"
                                value={ExpenseType.CREDIT_CARD}
                                onChange={(event) => {
                                  if (expense) {
                                    return;
                                  }

                                  if (
                                    value &&
                                    value === ExpenseType.CREDIT_CARD
                                  ) {
                                    onChange(null);

                                    return;
                                  }

                                  onChange(event.target.value);
                                }}
                              />

                              <label
                                htmlFor="credit-checkbox"
                                className={`p-2 md:py-2 md:px-4 rounded-2xl font-bold border border-emerald-300 dark:border-emerald-600 ${
                                  value && value === ExpenseType.CREDIT_CARD
                                    ? "bg-emerald-300 dark:bg-emerald-600 dar:text-zinc-50"
                                    : ""
                                } transition-colors cursor-pointer`}
                              >
                                {t("expenses.credit_card")}
                              </label>
                            </div>
                          </div>
                        );
                      }}
                    />

                    <p
                      className={`mt-1 text-sm ${
                        !!errors.expenseType && "text-red-500"
                      }`}
                    >
                      {errors.expenseType?.message}
                    </p>
                  </div>
                )}

                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name="price"
                    defaultValue={0}
                    rules={{
                      required: {
                        value: true,
                        message: t("utils.requiredField"),
                      },
                      validate: (value) => {
                        if (value && value <= 0) {
                          return t("commonValidations.mustBeGreaterThanZero");
                        }
                      },
                    }}
                    render={({ field: { value, onChange, name } }) => (
                      <Input
                        type="text"
                        label={t("expenses.price")}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={() => {
                          if (value) {
                            formatDecimalNumber({
                              value,
                              setFieldValue: (formattedValue: number) => {
                                setValue("price", formattedValue);
                              },
                            });
                          }
                        }}
                        error={errors?.price && !!errors?.price?.message}
                        helperText={errors?.price && errors?.price?.message}
                      />
                    )}
                  />
                </div>

                {!expense && (
                  <div className="col-span-12 sm:col-span-6 md:col-span-4">
                    <Controller
                      control={control}
                      name="expenseDate"
                      defaultValue={new Date()}
                      rules={{
                        required: {
                          value: true,
                          message: t("utils.requiredField"),
                        },
                      }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          label="expenses.date"
                          locale={locale}
                          value={value ? value : new Date()}
                          onChange={onChange}
                          error={errors?.price && !!errors?.price?.message}
                          helperText={errors?.price && errors?.price?.message}
                          disabled={!!expense}
                        />
                      )}
                    />
                  </div>
                )}
              </div>

              {!expense && (
                <h3 className="font-bold italic text-2xl mt-2">
                  {t("expenses.bankAndCard")}
                </h3>
              )}

              {!expense && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-6 md:col-span-4">
                    <Controller
                      control={control}
                      name="bankAccountId"
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
                            disabled={!!expense}
                          >
                            <div className="flex justify-between items-center w-full gap-2">
                              <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                <SelectValue></SelectValue>
                              </SelectTrigger>

                              {bankAccountId && (
                                <div
                                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                  onClick={() =>
                                    setValue("bankAccountId", null)
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

                  {expenseType === ExpenseType.CREDIT_CARD && (
                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <Controller
                        control={control}
                        name="creditCardId"
                        render={({ field: { value, onChange, name } }) => (
                          <Fragment>
                            <div className="mb-2">
                              <Label
                                name={name}
                                label={t("expenses.creditCard")}
                              />
                            </div>

                            <Select
                              onValueChange={onChange}
                              value={String(value)}
                              name={name}
                              disabled={!!expense}
                            >
                              <div className="flex justify-between items-center w-full gap-2">
                                <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                  <SelectValue></SelectValue>
                                </SelectTrigger>

                                {creditCardId && (
                                  <div
                                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                    onClick={() =>
                                      setValue("creditCardId", null)
                                    }
                                  >
                                    <IconX className="w-4 h-4" />
                                  </div>
                                )}
                              </div>

                              <SelectContent>
                                {creditCards.map((creditCard) => (
                                  <SelectItem
                                    key={creditCard.id}
                                    value={String(creditCard.id)}
                                  >
                                    <div className="p-2 flex rounded-md flex-row items-center gap-2">
                                      <Image
                                        src={`/images/logos/${creditCard.bank}.png`}
                                        width={512}
                                        height={512}
                                        alt={`${creditCard.bank} logo`}
                                        className="w-6 h-6 rounded-full"
                                      />

                                      <p>{creditCard.bank}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Fragment>
                        )}
                      />
                    </div>
                  )}

                  {expenseType === ExpenseType.CREDIT_CARD && (
                    <div className="col-span-12 sm:col-span-4">
                      <Controller
                        control={control}
                        name="installments"
                        render={({ field: { value, onChange, name } }) => (
                          <div className="w-full">
                            <div className="mb-2">
                              <Label
                                name={name}
                                label={t("expenses.installments")}
                              />
                            </div>

                            <Select
                              onValueChange={onChange}
                              value={String(value)}
                              name={name}
                              disabled={!!expense}
                            >
                              <div className="flex justify-between items-center w-full gap-2">
                                <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                                  <SelectValue></SelectValue>
                                </SelectTrigger>

                                {installments && (
                                  <div
                                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                    onClick={() =>
                                      setValue("installments", null)
                                    }
                                  >
                                    <IconX className="w-4 h-4" />
                                  </div>
                                )}
                              </div>

                              <SelectContent>
                                {[
                                  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                                  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                ].map((installments) => (
                                  <SelectItem
                                    key={installments}
                                    value={String(installments)}
                                  >
                                    <p>{installments}x</p>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              <h3 className="font-bold italic text-2xl mt-2">
                {t("expenses.category")}
              </h3>

              <div className="flex py-2 items-center overflow-auto no-scrollbar">
                <Fragment>
                  <Controller
                    control={control}
                    name="customCategory"
                    defaultValue={expense ? expense.customCategory?.id : null}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Fragment>
                          {customCategories.map((customCategory) => (
                            <div
                              key={customCategory.id}
                              className="min-w-fit p-2"
                            >
                              <input
                                className="hidden"
                                type="checkbox"
                                checked={
                                  value ? value === customCategory.id : false
                                }
                                id={`${customCategory.name}-category-checkbox`}
                                name={`${customCategory.name}-category-checkbox`}
                                value={customCategory.id}
                                onChange={(event) => {
                                  if (getValues("category")) {
                                    setValue("category", null);
                                  }

                                  if (
                                    value &&
                                    Number(value) === customCategory.id
                                  ) {
                                    onChange(null);

                                    return;
                                  }

                                  onChange(event.target.value);
                                }}
                              />

                              <label
                                htmlFor={`${customCategory.name}-category-checkbox`}
                                className="p-2 md:py-3 md:px-4 rounded-2xl font-bold border cursor-pointer transition-colors"
                                style={{
                                  borderColor: customCategory.color,
                                  backgroundColor:
                                    value && Number(value) === customCategory.id
                                      ? customCategory.color
                                      : "",
                                }}
                              >
                                {customCategory.name}
                              </label>
                            </div>
                          ))}
                        </Fragment>
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="category"
                    defaultValue={
                      expense
                        ? expense.customCategory
                          ? null
                          : ExpenseCategory[expense.category! as CategoryKey]
                        : ExpenseCategory.NA
                    }
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Fragment>
                          {Object.keys(categories).map((categoryKey) => {
                            const category =
                              categories[categoryKey as CategoryKey];

                            return (
                              <div key={categoryKey} className="min-w-fit p-2">
                                <input
                                  className="hidden"
                                  type="checkbox"
                                  checked={
                                    value
                                      ? value ===
                                        ExpenseCategory[
                                          categoryKey as CategoryKey
                                        ]
                                      : false
                                  }
                                  id={`${categoryKey}-category-checkbox`}
                                  name={`${categoryKey}-category-checkbox`}
                                  value={
                                    ExpenseCategory[categoryKey as CategoryKey]
                                  }
                                  onChange={(event) => {
                                    if (getValues("customCategory")) {
                                      setValue("customCategory", null);
                                    }

                                    if (
                                      value &&
                                      value ===
                                        ExpenseCategory[
                                          categoryKey as CategoryKey
                                        ]
                                    ) {
                                      onChange(null);

                                      return;
                                    }

                                    onChange(event.target.value);
                                  }}
                                />

                                <label
                                  htmlFor={`${categoryKey}-category-checkbox`}
                                  className={`flex items-center gap-2 p-2 md:py-2 md:px-4 rounded-2xl font-bold border border-zinc-300 dark:border-zinc-500 cursor-pointer ${
                                    value &&
                                    value ===
                                      ExpenseCategory[
                                        categoryKey as CategoryKey
                                      ]
                                      ? "bg-zinc-300 dark:bg-zinc-500"
                                      : ""
                                  } transition-colors`}
                                >
                                  {category.lang[
                                    locale as Locale
                                  ].toLowerCase()}

                                  {category.icon}
                                </label>
                              </div>
                            );
                          })}
                        </Fragment>
                      );
                    }}
                  />
                </Fragment>
              </div>
            </div>

            <div className="mt-2 p-2 md:p-6 flex gap-2 justify-end">
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

  if (expense) {
    return FormContent;
  }

  return (
    <Card
      title={"expenses.newExpense"}
      icon={<IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/expenses")}
          />
        </div>
      }
    >
      {FormContent}
    </Card>
  );
};

export default ExpenseForm;
