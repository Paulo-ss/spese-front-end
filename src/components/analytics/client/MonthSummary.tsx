"use client";

import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { IMonthSummary } from "@/interfaces/analytics.interface";
import { IAPIError } from "@/interfaces/api-error.interface";
import { fetchResource } from "@/services/fetchService";
import { useTranslations } from "next-intl";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MonthSummaryLoading from "../loding/MonthSummaryLoading";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import {
  IconCheckbox,
  IconCurrencyDollar,
  IconPlusMinus,
} from "@tabler/icons-react";
import { theme } from "@/lib/theme/theme";
import { Fade } from "react-awesome-reveal";
import { formatDate } from "@/utils/dates/dateUtils";

interface IProps {
  initialMonthSummary?: IMonthSummary;
  error?: IAPIError;
  locale: string;
}

const MonthSummary: FC<IProps> = ({ initialMonthSummary, error, locale }) => {
  const { date, updateIsLoading } = useContext(GlobalDateContext);
  const t = useTranslations();

  const [monthSummary, setMonthSummary] = useState(initialMonthSummary);
  const [errorMessage, setErrorMessage] = useState(
    error ? error.errorMessage : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

  const fetchMonthSummary = useCallback(async () => {
    try {
      updateIsLoading(true);
      setIsLoading(true);

      const selectedMonth = formatDate(date, "YYYY-MM");

      const { data, error } = await fetchResource<IMonthSummary>({
        url: "/analytics/month-summary",
        config: {
          options: {
            method: "POST",
            body: JSON.stringify({ month: selectedMonth }),
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

      setMonthSummary(data);
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
      fetchMonthSummary();
      return;
    }

    isFirstRender.current = false;
  }, [date, fetchMonthSummary]);

  if (isLoading) {
    return <MonthSummaryLoading />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 rounded-md">
      {errorMessage ? (
        <ErrorDisplay errorMessage={errorMessage} />
      ) : (
        <Fragment>
          <Fade duration={300} direction="left" triggerOnce cascade>
            <div className="col-span-1 flex items-center gap-2 p-2 md:p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-center p-3 rounded-md bg-emerald-100 dark:bg-emerald-300">
                <IconCurrencyDollar color={theme.colors.emerald[500]} />
              </div>

              <div className="">
                <p className="text-base text-zinc-500 dark:text-zinc-300">
                  {t("analytics.budget")}
                </p>

                <p className="text-base md:text-lg font-bold">
                  {monthSummary?.budget.toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-2 p-2 md:p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-center p-3 rounded-md bg-red-100 dark:bg-red-300">
                <IconCurrencyDollar color={theme.colors.red[500]} />
              </div>

              <div className="">
                <p className="text-base text-zinc-500 dark:text-zinc-300">
                  {t("analytics.expensesTotal")}
                </p>

                <p className="text-base md:text-lg font-bold">
                  {monthSummary?.expensesTotal.toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-2 p-2 md:p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-center p-3 rounded-md bg-sky-100 dark:bg-sky-300">
                <IconCheckbox color={theme.colors.sky[500]} />
              </div>

              <div className="">
                <p className="text-base text-zinc-500 dark:text-zinc-300">
                  {t("analytics.paidTotal")}
                </p>

                <p className="text-base md:text-lg font-bold">
                  {monthSummary?.paidTotal.toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-2 p-2 md:p-3 rounded-md shadow-sm bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-center p-3 rounded-md bg-zinc-100 dark:bg-zinc-300">
                <IconPlusMinus color={theme.colors.zinc[500]} />
              </div>

              <div className="">
                <p className="text-base text-zinc-500 dark:text-zinc-300">
                  {t("analytics.monthBalance")}
                </p>

                <p className="text-base md:text-lg font-bold">
                  {monthSummary?.monthBalance.toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>
            </div>
          </Fade>
        </Fragment>
      )}
    </div>
  );
};

export default MonthSummary;
