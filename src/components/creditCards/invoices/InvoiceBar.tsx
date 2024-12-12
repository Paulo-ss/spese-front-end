"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICreditCardSummary } from "@/interfaces/credit-card.interface";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface IProps {
  creditCard: ICreditCardSummary;
  locale: string;
}

const InvoiceBar: FC<IProps> = ({ creditCard, locale }) => {
  const t = useTranslations();

  const closedMonthWidth = (creditCard.closedTotal / creditCard.limit) * 100;
  const currentMonthWidth =
    (creditCard.currentMonthInvoiceTotal / creditCard.limit) * 100;
  const nextMonthsWidth =
    (creditCard.otherMonthsTotal / creditCard.limit) * 100;

  return (
    <div className="relative rounded-3xl overflow-hidden h-4 w-full bg-zinc-100 dark:bg-zinc-800 mb-1">
      {creditCard.closedTotal > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="absolute top-0 left-0 bg-red-500 h-4 mb-1"
              style={{
                width: `${closedMonthWidth}%`,
              }}
            />

            <TooltipContent>
              <p>
                {t("creditCard.closedInvoice")}:
                {creditCard.closedTotal.toLocaleString(locale, {
                  style: "currency",
                  currency: locale === "pt" ? "BRL" : "USD",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {creditCard.currentMonthInvoiceTotal > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="absolute top-0 bg-sky-500 h-4 mb-1"
              style={{
                left: `${closedMonthWidth}%`,
                width: `${currentMonthWidth}%`,
              }}
            />

            <TooltipContent>
              <p>
                {t("creditCard.currentInvoice")}:
                {creditCard.currentMonthInvoiceTotal.toLocaleString(locale, {
                  style: "currency",
                  currency: locale === "pt" ? "BRL" : "USD",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {creditCard.otherMonthsTotal > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="absolute top-0 bg-amber-500 h-4 mb-1"
              style={{
                left: `${closedMonthWidth + currentMonthWidth}%`,
                width: `${nextMonthsWidth}%`,
              }}
            />

            <TooltipContent>
              <p>
                {t("creditCard.nextMonths")}:
                {creditCard.otherMonthsTotal.toLocaleString(locale, {
                  style: "currency",
                  currency: locale === "pt" ? "BRL" : "USD",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default InvoiceBar;
