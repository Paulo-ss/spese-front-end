"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import CardLoading from "@/components/ui/loading/CardLoading";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IExpense } from "@/interfaces/expenses.interface";
import { fetchResource } from "@/services/fetchService";
import {
  IconChevronRight,
  IconClipboardOff,
  IconCoins,
  IconPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ExpenseItem from "./ExpenseItem";

interface IProps {
  locale: string;
  initialExpenses?: IExpense[];
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

  const [expenses, setExpenses] = useState(
    initialExpenses
      ? limit
        ? initialExpenses!.splice(0, limit)
        : initialExpenses
      : undefined
  );
  const [errorMessage, setErrorMessage] = useState(
    error ? error.errorMessage : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

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
          expense.expenseDate = new Date(
            expense.expenseDate
          ).toLocaleDateString(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });
        }
      }

      setExpenses(data);
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
          {expenses && expenses.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {expenses?.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Expenses;
