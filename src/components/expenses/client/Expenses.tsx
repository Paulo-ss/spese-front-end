"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { IAPIError } from "@/interfaces/api-error.interface";
import {
  ExpenseGroup as ExpenseGroupType,
  IExpense,
  IExpensesFilters,
} from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";
import {
  IconChevronRight,
  IconClipboardOff,
  IconCoins,
  IconPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import limitExpenses from "@/utils/expenses/limitExpenses";
import ExpenseGroup from "./ExpenseGroup";
import { usePathname } from "next/navigation";
import ExpensesFilters from "./ExpensesFilters";
import groupExpensesByCategory from "@/utils/expenses/groupExpensesByCategory";
import { Accordion } from "@/components/ui/accordion";
import getFormState from "@/utils/getFormState";
import { ExpenseCategory } from "@/enums/expenses.enum";
import { formatDate, formatForLocale } from "@/utils/dates/dateUtils";
import { formatCurrencyForLocale } from "@/utils/numbers/formatCurrencyForLocale";
import { Locale } from "@/types/locale.type";

interface IProps {
  locale: Locale;
  initialExpenses?: ExpenseGroupType;
  error?: IAPIError;
  limit?: number;
  displayFilters?: boolean;
}

const Expenses: FC<IProps> = ({
  initialExpenses,
  error,
  locale,
  limit,
  displayFilters,
}) => {
  const { date, fromDate, toDate, updateIsLoading } =
    useContext(GlobalDateContext);
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const isExpensesPage = pathname.includes("expenses");

  const [expenses, setExpenses] = useState<ExpenseGroupType | undefined>(
    initialExpenses
      ? limit
        ? limitExpenses<ExpenseGroupType>(initialExpenses, {
            limit,
            groupExpenses: true,
          })
        : initialExpenses
      : undefined,
  );
  const [errorMessage, setErrorMessage] = useState(
    error ? error.errorMessage : undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

  const ungroupedExpenses = expenses
    ? limitExpenses<IExpense[]>(expenses!, {})
    : undefined;

  const updateLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  const fetchExpenses = useCallback(async () => {
    try {
      if (isExpensesPage && (!fromDate || !toDate)) {
        return;
      }

      updateIsLoading(true);
      setIsLoading(true);

      const selectedDate = isExpensesPage ? fromDate! : date;

      const selectedMonth = formatDate(
        selectedDate,
        isExpensesPage ? "YYYY-MM-DD" : "YYYY-MM",
      );
      const selectedToMonth = isExpensesPage
        ? formatDate(toDate!, "YYYY-MM-DD")
        : undefined;

      const formFiltersState =
        getFormState<IExpensesFilters>("expensesFormState");

      const body: IExpensesFilters = {
        month: !isExpensesPage ? selectedMonth : null,
        fromDate: isExpensesPage ? selectedMonth : null,
        toDate: isExpensesPage ? selectedToMonth! : null,
        creditCardId: Number(formFiltersState?.creditCardId),
        status: formFiltersState?.status,
        priceRange: formFiltersState?.priceRange,
        name: formFiltersState?.name,
        category: formFiltersState?.customCategory
          ? ExpenseCategory.CUSTOM
          : formFiltersState?.category,
        customCategory: Number(formFiltersState?.customCategory),
      };

      const { data: expenses, error } = await fetchResource<IExpense[]>({
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
            : error.errorMessage,
        );
      }

      if (expenses) {
        for (const expense of expenses) {
          expense.expenseDate = formatForLocale({
            date: expense.expenseDate,
            locale,
          });
        }
      }

      setExpenses(expenses ? groupExpensesByCategory(expenses) : undefined);
    } catch (error) {
      if (error && error instanceof Error) {
        setErrorMessage(error.message ?? t("utils.somethingWentWrong"));
      }
    } finally {
      updateIsLoading(false);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, fromDate, toDate]);

  useEffect(() => {
    if (!isFirstRender.current) {
      fetchExpenses();
      return;
    }

    isFirstRender.current = false;
  }, [date, fromDate, toDate, fetchExpenses]);

  if (isLoading) {
    return (
      <CardLoading>
        <ListItemLoading items={4} />
      </CardLoading>
    );
  }

  return (
    <Card
      title={`${t("expenses.DEFAULT")} ${ungroupedExpenses ? "-" : ""} ${
        ungroupedExpenses
          ? formatCurrencyForLocale({
              number: ungroupedExpenses.reduce(
                (total, expense) => total + Number(expense.price),
                0,
              ),
              locale,
            })
          : ""
      }`}
      translateTitle={false}
      icon={<IconCoins />}
      action={
        <div className="flex items-center gap-2">
          {displayFilters && (
            <ExpensesFilters
              isLoading={isLoading}
              updateLoading={updateLoading}
              updateErrorMessage={(errorMessage) =>
                setErrorMessage(errorMessage)
              }
              updateExpenses={(expenses) =>
                setExpenses(
                  expenses ? groupExpensesByCategory(expenses) : undefined,
                )
              }
              locale={locale}
              isExpensesPage={isExpensesPage}
            />
          )}

          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/expenses/create")}
          />

          {!isExpensesPage && (
            <IconButton
              type="button"
              color="secondary"
              variant="outlined"
              icon={<IconChevronRight />}
              onClick={() => router.push("/expenses")}
            />
          )}
        </div>
      }
    >
      {errorMessage ? (
        <ErrorDisplay errorMessage={errorMessage} />
      ) : (
        <Fragment>
          {ungroupedExpenses && ungroupedExpenses.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <Accordion
              className="flex flex-col gap-3"
              type="multiple"
              defaultValue={["0"]}
            >
              {Object.keys(expenses!).map((category, index) => {
                const groupedExpenses = expenses![category];

                return (
                  <ExpenseGroup
                    key={category}
                    locale={locale}
                    expenses={groupedExpenses}
                    groupName={category}
                    index={index}
                  />
                );
              })}
            </Accordion>
          )}

          {limit && ungroupedExpenses && ungroupedExpenses.length >= limit && (
            <div className="flex justify-center items-center gap-3 mt-3">
              <span className="w-2 h-2 bg-transparent border border-zinc-600 dark:border-zinc-200 rounded-full" />
              <span className="w-2 h-2 bg-transparent border border-zinc-600 dark:border-zinc-200 rounded-full" />
              <span className="w-2 h-2 bg-transparent border border-zinc-600 dark:border-zinc-200 rounded-full" />
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Expenses;
