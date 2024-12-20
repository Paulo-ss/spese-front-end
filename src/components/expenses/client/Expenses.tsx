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
import groupExpensesByDate from "@/utils/expenses/groupExpensesByDate";
import ExpenseGroup from "./ExpenseGroup";

interface IProps {
  locale: string;
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
  const { date, updateIsLoading } = useContext(GlobalDateContext);
  const t = useTranslations();
  const router = useRouter();

  const [expenses, setExpenses] = useState<ExpenseGroupType | undefined>(
    initialExpenses
      ? limit
        ? limitExpenses<ExpenseGroupType>(initialExpenses, {
            limit,
            groupExpenses: true,
          })
        : initialExpenses
      : undefined
  );
  const [errorMessage, setErrorMessage] = useState(
    error ? error.errorMessage : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

  const ungroupedExpenses = expenses
    ? limitExpenses<IExpense[]>(expenses!, {})
    : undefined;

  const fetchExpenses = useCallback(async () => {
    try {
      updateIsLoading(true);
      setIsLoading(true);

      const selectedMonth = date
        .toLocaleDateString("en", { month: "2-digit", year: "numeric" })
        .replace("/", "-");

      const { data, error } = await fetchResource<IExpense[]>({
        url: "/expense/filter",
        config: {
          options: {
            method: "POST",
            body: JSON.stringify({ fromMonth: selectedMonth }),
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

      setExpenses(data ? groupExpensesByDate(data) : undefined);
    } catch (error) {
      if (error && error instanceof Error) {
        setErrorMessage(error.message ?? t("utils.somethingWentWrong"));
      }
    } finally {
      updateIsLoading(false);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    if (!isFirstRender.current) {
      fetchExpenses();
      return;
    }

    isFirstRender.current = false;
  }, [date, fetchExpenses]);

  if (isLoading) {
    return (
      <CardLoading>
        <ListItemLoading items={4} />
      </CardLoading>
    );
  }

  return (
    <Card
      title="expenses.yourExpenses"
      icon={<IconCoins />}
      action={
        <div className="flex items-center gap-2">
          {displayFilters && <div></div>}

          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/expenses/create")}
          />

          <IconButton
            type="button"
            color="secondary"
            variant="outlined"
            icon={<IconChevronRight />}
            onClick={() => router.push("/expenses")}
          />
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
            <div className="flex flex-col gap-3">
              {displayFilters && (
                <p className="self-end">
                  Total:{" "}
                  {ungroupedExpenses!
                    .reduce(
                      (total, expense) => total + Number(expense.price),
                      0
                    )
                    .toLocaleString(locale, {
                      style: "currency",
                      currency: locale === "pt" ? "BRL" : "USD",
                    })}
                </p>
              )}

              {Object.keys(expenses!).map((expensesDate) => {
                const groupedExpenses = expenses![expensesDate];

                return (
                  <ExpenseGroup
                    key={expensesDate}
                    locale={locale}
                    expenses={groupedExpenses}
                    expensesDate={expensesDate}
                  />
                );
              })}
            </div>
          )}

          {limit && ungroupedExpenses && ungroupedExpenses.length > limit && (
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
