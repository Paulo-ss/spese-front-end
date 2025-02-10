"use client";

import { fetchResource } from "@/services/fetchService";
import { useTranslations } from "next-intl";
import { FC, Fragment, useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import {
  IconChartCandle,
  IconRestore,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import IconButton from "../../ui/button/IconButton";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import { Controller, useForm } from "react-hook-form";
import Label from "../../ui/label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select/Select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Loader from "../../ui/loader/Loader";
import saveFormState from "@/utils/saveFormState";
import getFormState from "@/utils/getFormState";
import { IExpense, IExpensesFilters } from "@/interfaces/expenses.interface";
import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import Input from "@/components/ui/input/Input";
import Divider from "@/components/ui/divider/Divider";
import { Slider } from "@/components/ui/slider";
import { ExpenseCategory, ExpenseStatus } from "@/enums/expenses.enum";
import { CategoryKey, ICategory } from "@/interfaces/category.interface";
import { categories } from "@/utils/category/categoriesLangIcon";
import { Locale } from "@/types/locale.type";

interface IProps {
  isLoading: boolean;
  updateLoading: (isLoading: boolean) => void;
  updateExpenses: (expenses: IExpense[] | undefined) => void;
  updateErrorMessage: (errorMessage: string) => void;
  locale: string;
  isExpensesPage: boolean;
}

const ExpensesFilters: FC<IProps> = ({
  isLoading,
  updateLoading,
  updateExpenses,
  updateErrorMessage,
  locale,
  isExpensesPage,
}) => {
  const { date, fromDate, toDate } = useContext(GlobalDateContext);
  const { control, getValues, reset, setValue } = useForm<IExpensesFilters>();

  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
  const [customCategories, setCustomCategories] = useState<ICategory[]>([]);
  const [isLoadingCreditCards, setIsLoadingCreditCards] = useState(false);

  const t = useTranslations();
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      if (isExpensesPage && (!fromDate || !toDate)) {
        return;
      }

      const formData = getValues();

      updateLoading(true);

      saveFormState<IExpensesFilters>(formData, "expensesFormState");

      const selectedDate = isExpensesPage ? fromDate! : date;

      const selectedMonth = selectedDate
        .toLocaleDateString("en", {
          day: isExpensesPage ? "2-digit" : undefined,
          month: "2-digit",
          year: "numeric",
        })
        .replaceAll("/", "-");
      const selectedToMonth = isExpensesPage
        ? toDate!
            .toLocaleDateString("en", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replaceAll("/", "-")
        : undefined;

      const body: IExpensesFilters = {
        month: !isExpensesPage ? selectedMonth : null,
        fromDate: isExpensesPage ? selectedMonth : null,
        toDate: isExpensesPage ? selectedToMonth! : null,
        creditCardId: Number(formData.creditCardId),
        status: formData.status,
        priceRange: formData.priceRange,
        name: formData.name,
        category: formData.customCategory
          ? ExpenseCategory.CUSTOM
          : formData.category,
        customCategory: Number(formData.customCategory),
      };

      const { data, error } = await fetchResource<IExpense[]>({
        url: "/expense/filter",
        config: {
          options: {
            method: "POST",
            body: JSON.stringify(body),
          },
        },
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      if (data) {
        for (const expense of data) {
          const [year, month, day] = expense.expenseDate.split("-").map(Number);

          expense.expenseDate = new Date(
            year,
            month - 1,
            day
          ).toLocaleDateString(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });
        }
      }

      updateExpenses(data);
    } catch (error) {
      if (error && error instanceof Error) {
        updateErrorMessage(error.message ?? t("utils.somethingWentWrong"));
      }
    } finally {
      updateLoading(false);
    }
  };

  const fetchCreditCards = async () => {
    try {
      setIsLoadingCreditCards(true);

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
    } finally {
      setIsLoadingCreditCards(false);
    }
  };

  const fetchCustomCategories = async () => {
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
  };

  useEffect(() => {
    const defaultFormValues =
      getFormState<IExpensesFilters>("expensesFormState");

    if (defaultFormValues) {
      setValue("creditCardId", defaultFormValues.creditCardId);
      setValue("status", defaultFormValues.status);
      setValue("priceRange", defaultFormValues.priceRange);
      setValue("name", defaultFormValues.name);
      setValue("category", defaultFormValues.category);
      setValue("customCategory", defaultFormValues.customCategory);
    }
  }, [setValue]);

  return (
    <Drawer
      open={isDrawerOpened}
      onOpenChange={(isOpened) => setIsDrawerOpened(isOpened)}
    >
      <DrawerTrigger
        asChild
        onClick={() => {
          fetchCreditCards();
          fetchCustomCategories();
        }}
      >
        <IconButton
          type="button"
          color="neutral"
          variant="outlined"
          icon={<IconChartCandle />}
        />
      </DrawerTrigger>

      <DrawerContent aria-describedby="">
        <DrawerHeader>
          <DrawerTitle>
            {t("utils.filter", { name: t("incomes.DEFAULT") })}
          </DrawerTitle>
        </DrawerHeader>

        <div className="text-sm grow p-6 overflow-auto">
          <Controller
            control={control}
            defaultValue=""
            name="name"
            render={({ field: { value, onChange, name } }) => (
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  label={t("expenses.name")}
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              </div>
            )}
          />

          <Divider />

          <Controller
            control={control}
            name="priceRange"
            defaultValue={[1, 2000]}
            render={({ field: { value, onChange, name } }) => {
              const formatValueToCurrency = (value: number) => {
                return value.toLocaleString(locale, {
                  style: "currency",
                  currency: locale === "pt" ? "BRL" : "USD",
                });
              };

              const label = `${t(
                "expenses.priceRange"
              )} - ${formatValueToCurrency(
                value![0]
              )} / ${formatValueToCurrency(value![1])}`;

              return (
                <div className="w-full">
                  <div className="mb-5">
                    <Label name={name} label={label} />
                  </div>

                  <Slider
                    value={value!}
                    onValueChange={onChange}
                    max={30000}
                    min={0.01}
                    step={10}
                    minStepsBetweenThumbs={1}
                  />
                </div>
              );
            }}
          />

          <Divider />

          <div className="flex flex-col gap-1">
            <p>{t("category.DEFAULT")}</p>

            <div className="flex py-2 items-center overflow-auto no-scrollbar">
              <Controller
                control={control}
                name="customCategory"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Fragment>
                      {customCategories.map((customCategory) => (
                        <div key={customCategory.id} className="min-w-fit p-2">
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
                render={({ field: { value, onChange } }) => {
                  return (
                    <Fragment>
                      {Object.keys(categories).map((categoryKey) => {
                        const category = categories[categoryKey as CategoryKey];

                        return (
                          <div key={categoryKey} className="min-w-fit p-2">
                            <input
                              className="hidden"
                              type="checkbox"
                              checked={
                                value
                                  ? value ===
                                    ExpenseCategory[categoryKey as CategoryKey]
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
                                    ExpenseCategory[categoryKey as CategoryKey]
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
                                  ExpenseCategory[categoryKey as CategoryKey]
                                  ? "bg-zinc-300 dark:bg-zinc-500"
                                  : ""
                              } transition-colors`}
                            >
                              {category.lang[locale as Locale].toLowerCase()}

                              {category.icon}
                            </label>
                          </div>
                        );
                      })}
                    </Fragment>
                  );
                }}
              />
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-4">
            <p>{t("expenses.status")}</p>

            <Controller
              control={control}
              name="status"
              render={({ field: { value, onChange } }) => {
                return (
                  <div className="flex gap-2 items-center mb-3">
                    <div>
                      <input
                        className="hidden"
                        type="checkbox"
                        checked={
                          value ? value! === ExpenseStatus.PENDING : false
                        }
                        id="pending-checkbox"
                        name="pending-checkbox"
                        value={ExpenseStatus.PENDING}
                        onChange={(event) => {
                          if (value && value === ExpenseStatus.PENDING) {
                            onChange(null);

                            return;
                          }

                          onChange(event.target.value);
                        }}
                      />

                      <label
                        htmlFor="pending-checkbox"
                        className={`p-2 md:py-2 md:px-4 rounded-2xl font-bold border border-amber-500 dark:border-amber-700 cursor-pointer ${
                          value && value === ExpenseStatus.PENDING
                            ? "bg-amber-500 dark:bg-amber-700 text-zinc-50"
                            : ""
                        } transition-colors`}
                      >
                        {t("expenses.PENDING")}
                      </label>
                    </div>

                    <div>
                      <input
                        className="hidden"
                        type="checkbox"
                        checked={value ? value! === ExpenseStatus.PAID : false}
                        id="paid-checkbox"
                        name="paid-checkbox"
                        value={ExpenseStatus.PAID}
                        onChange={(event) => {
                          if (value && value === ExpenseStatus.PAID) {
                            onChange(null);

                            return;
                          }

                          onChange(event.target.value);
                        }}
                      />

                      <label
                        htmlFor="paid-checkbox"
                        className={`p-2 md:py-2 md:px-4 rounded-2xl font-bold border border-emerald-400 dark:border-emerald-600 cursor-pointer ${
                          value && value === ExpenseStatus.PAID
                            ? "bg-emerald-400 dark:bg-emerald-600 text-zinc-50"
                            : ""
                        } transition-colors`}
                      >
                        {t("expenses.PAID")}
                      </label>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          <Divider />

          <Controller
            control={control}
            name="creditCardId"
            render={({ field: { value, onChange, name } }) => (
              <div className="w-full md:w-1/3">
                <div className="mb-2">
                  <Label
                    name={name}
                    label={t("subscriptions.selectACreditCard")}
                  />
                </div>

                <Select
                  onValueChange={onChange}
                  value={String(value)}
                  name={name}
                >
                  <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                    <div className="flex justify-between items-center w-full gap-2">
                      <SelectValue
                        placeholder={
                          !isLoadingCreditCards ? <Loader /> : undefined
                        }
                      />

                      {getValues("creditCardId") && (
                        <div
                          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          onClick={() => setValue("creditCardId", null)}
                        >
                          <IconX className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    {creditCards.map((creditCard) => (
                      <SelectItem
                        key={creditCard.id}
                        value={String(creditCard.id)}
                      >
                        <div className="p-2 flex flex-row items-center gap-2">
                          <Image
                            src={`/images/logos/${creditCard.bank}.png`}
                            width={512}
                            height={512}
                            alt={`${value} logo`}
                            className="w-6 h-6 rounded-full"
                          />

                          <p>{creditCard.nickname}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>

        <DrawerFooter>
          <IconButton
            type="button"
            color="neutral"
            icon={<IconX />}
            onClick={() => {
              saveFormState<IExpensesFilters>(getValues(), "expensesFormState");
              setIsDrawerOpened(false);
            }}
          />

          <IconButton
            type="button"
            color="info"
            onClick={() => {
              reset({
                creditCardId: null,
                category: null,
                customCategory: null,
                name: "",
                priceRange: [1, 2000],
                status: null,
              });
            }}
            icon={<IconRestore />}
            disabled={isLoading}
            isLoading={isLoading}
          />

          <IconButton
            type="button"
            color="secondary"
            onClick={fetchExpenses}
            icon={<IconSearch />}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ExpensesFilters;
