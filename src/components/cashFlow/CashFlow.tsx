"use client";

import { FC } from "react";
import EventCalendar from "../ui/eventCalendar/EventCalendar";
import { ICashFlowResponse } from "@/interfaces/cash-flow.interface";
import { IAPIError } from "@/interfaces/api-error.interface";
import { useTranslations } from "next-intl";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { formatCurrencyForLocale } from "@/utils/numbers/formatCurrencyForLocale";
import { Locale } from "@/types/locale.type";

interface IProps {
  cashFlow?: ICashFlowResponse;
  error?: IAPIError;
  locale: Locale;
}

const CashFlow: FC<IProps> = ({ cashFlow, error, locale }) => {
  const t = useTranslations();

  if (error || !cashFlow) {
    return (
      <ErrorDisplay
        errorMessage={error?.errorMessage ?? t("utils.somethingWentWrong")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {cashFlow!.currentAccountsBalance && (
        <div className="flex flex-col gap-2">
          <h1>{t("cashFlow.currentAccountBalance")}</h1>

          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                  cashFlow!.currentAccountsBalance >= 0
                    ? "bg-emerald-300 dark:bg-emerald-700"
                    : "bg-red-500 dark:bg-red-700"
                } opacity-75`}
              />
              <span
                className={`relative inline-flex size-3 rounded-full ${
                  cashFlow!.currentAccountsBalance >= 0
                    ? "bg-emerald-300 dark:bg-emerald-700"
                    : "bg-red-500 dark:bg-red-700"
                }`}
              />
            </span>

            <h3
              className={`text-2xl font-bold ${
                cashFlow!.currentAccountsBalance < 0 &&
                "text-red-500 dark:text-red-700"
              }`}
            >
              {formatCurrencyForLocale({
                number: cashFlow!.currentAccountsBalance,
                locale,
              })}
            </h3>
          </div>
        </div>
      )}

      <EventCalendar
        locale={locale}
        initialDailyCashFlow={cashFlow.dailyCashFlow}
      />
    </div>
  );
};

export default CashFlow;
