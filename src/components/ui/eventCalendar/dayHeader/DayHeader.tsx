"use client";

import { TDailyCashFlow } from "@/interfaces/cash-flow.interface";
import { formatDate, formatForLocale } from "@/utils/dates/dateUtils";
import { formatCurrencyForLocale } from "@/utils/numbers/formatCurrencyForLocale";
import { Locale } from "@/types/locale.type";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { HeaderProps } from "react-big-calendar";

interface IProps extends HeaderProps {
  dailyCashFlow: TDailyCashFlow;
  locale: Locale;
}

const DayHeader: FC<IProps> = ({ dailyCashFlow, locale, date }) => {
  const t = useTranslations();

  const getDateCashFlow = () => {
    const dateCashFlow = dailyCashFlow[formatDate(date, "YYYY-MM-DD")];

    return dateCashFlow?.closingBalance ? dateCashFlow : undefined;
  };

  const dateCashFlow = getDateCashFlow();

  return (
    <div className="flex items-center justify-between w-full p-4">
      <p>
        {formatForLocale({
          date,
          locale,
          options: { day: "2-digit", month: "long", year: "numeric" },
        })}
      </p>

      {dateCashFlow && (
        <div className="flex flex-col items-end">
          <p className="italic">{t("cashFlow.dayBalance")}</p>

          <p
            className={`text-base md:text-lg font-bold ${
              Number(dateCashFlow.closingBalance) < 0 && "text-red-500"
            }`}
          >
            {formatCurrencyForLocale({
              number: Number(dateCashFlow.closingBalance),
              locale,
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default DayHeader;
