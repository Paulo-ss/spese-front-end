"use client";

import { TDailyCashFlow } from "@/interfaces/cash-flow.interface";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { HeaderProps } from "react-big-calendar";

interface IProps extends HeaderProps {
  dailyCashFlow: TDailyCashFlow;
  locale: string;
}

const DayHeader: FC<IProps> = ({ dailyCashFlow, locale, date }) => {
  const t = useTranslations();

  const getDateCashFlow = () => {
    const dateMinusThreeHours = new Date(date);
    dateMinusThreeHours.setHours(date.getHours() - 3);

    const dateCashFlow = dailyCashFlow[dateMinusThreeHours.toISOString()];

    return dateCashFlow?.closingBalance ? dateCashFlow : undefined;
  };

  const dateCashFlow = getDateCashFlow();

  return (
    <div className="flex items-center justify-between w-full p-4">
      <p>
        {date.toLocaleDateString(locale, {
          day: "2-digit",
          month: "long",
          year: "numeric",
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
            {Number(dateCashFlow.closingBalance).toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default DayHeader;
