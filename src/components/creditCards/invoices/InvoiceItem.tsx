"use client";

import { CarouselItem } from "@/components/ui/carousel";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { InvoiceStatus } from "@/enums/invoice.enum";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IExpense } from "@/interfaces/expenses.interface";
import { IInvoice } from "@/interfaces/invoice.interface";
import { fetchResource } from "@/services/fetchService";
import { useTranslations } from "next-intl";
import { FC, Fragment, useCallback, useEffect, useState } from "react";

interface IProps {
  locale: string;
  invoice: IInvoice;
  index: number;
  currentSlide: number;
}

const today = new Date();

const InvoiceItem: FC<IProps> = ({ locale, invoice, index, currentSlide }) => {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IAPIError | null>(null);

  const t = useTranslations();

  const invoicesColors = {
    [InvoiceStatus.PAID]: "bg-emerald-500 text-zinc-900",
    [InvoiceStatus.CLOSED]: "bg-red-500 text-zinc-900",
    [InvoiceStatus.DELAYED]: "bg-red-500 text-zinc-900",
    [InvoiceStatus.OPENED_CURRENT]: "bg-sky-500 text-zinc-900",
    [InvoiceStatus.OPENED_FUTURE]: "bg-amber-500 text-zinc-900",
  };

  const [dueYear, dueMonth, dueDay] = invoice.dueDate.split("-").map(Number);
  const formattedDueDate = new Date(
    dueYear,
    dueMonth - 1,
    dueDay
  ).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: dueYear !== today.getFullYear() ? "2-digit" : undefined,
  });

  const [closingYear, closingMonth, closingDay] = invoice.closingDate
    .split("-")
    .map(Number);
  const formattedClosingDate = new Date(
    closingYear,
    closingMonth - 1,
    closingDay
  ).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: closingYear !== today.getFullYear() ? "2-digit" : undefined,
  });

  const formattedPrice = Number(invoice.currentPrice).toLocaleString(locale, {
    style: "currency",
    currency: locale === "pt" ? "BRL" : "USD",
  });

  const fetchInvoiceExpenses = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await fetchResource<IInvoice>({
        url: `/credit-card/invoice/${invoice.id}`,
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setExpenses(data!.expenses);
    } catch (error) {
      if (error instanceof Error) {
        setError({
          errorMessage: error.message,
          path: "",
          statusCode: 500,
          timestamp: "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [invoice.id]);

  useEffect(() => {
    if (index === currentSlide && expenses.length === 0) {
      fetchInvoiceExpenses();
    }
  }, [currentSlide, fetchInvoiceExpenses, index, expenses.length]);

  return (
    <CarouselItem key={invoice.id} className="pl-0">
      <div className="w-full flex flex-col items-center">
        <div
          className={`w-full min-h-32 flex flex-col items-center justify-center ${
            invoicesColors[invoice.status]
          } p-4`}
        >
          <p className="text-2xl font-bold">{formattedPrice}</p>

          <p>
            {t("creditCard.due")} {formattedDueDate}
          </p>

          {invoice.status === InvoiceStatus.CLOSED && (
            <p>{t("creditCard.closedInvoice")}</p>
          )}

          {invoice.status === InvoiceStatus.OPENED_CURRENT && (
            <p>
              {t("creditCard.currentInvoice")} - {t("creditCard.closes")}{" "}
              {formattedClosingDate}
            </p>
          )}
        </div>

        <div className="p-6 flex flex-col w-full">
          {error ? (
            <ErrorDisplay errorMessage={error.errorMessage} />
          ) : (
            <Fragment>
              {isLoading ? (
                <ListItemLoading items={6} />
              ) : (
                <div className="w-full">
                  {expenses.map((expense, index) => {
                    const [year, month, day] = expense.expenseDate
                      .split("-")
                      .map(Number);
                    const formattedExpenseDate = new Date(
                      year,
                      month - 1,
                      day
                    ).toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "short",
                    });

                    return (
                      <div
                        key={expense.id}
                        className={`w-full flex justify-between items-center gap-2 md:gap-4 text-sm md:text-base text-zinc-600 dark:text-zinc-300 ${
                          index > 0 && "mt-2"
                        }`}
                      >
                        <p>{formattedExpenseDate}</p>

                        <p className="grow font-bold text-nowrap text-ellipsis overflow-hidden whitespace-nowrap">
                          {expense.name}{" "}
                          {expense.installmentNumber &&
                            `${expense.installmentNumber} / ${expense.totalInstallments}`}
                        </p>

                        <p>
                          {Number(expense.price).toLocaleString(locale, {
                            style: "currency",
                            currency: locale === "pt" ? "BRL" : "USD",
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </CarouselItem>
  );
};

export default InvoiceItem;
