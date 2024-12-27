"use client";

import payInvoice from "@/app/actions/creditCard/invoices/payInvoice";
import ExpenseSummarizedItem from "@/components/expenses/client/ExpenseSummarizedItem";
import Button from "@/components/ui/button/Button";
import { CarouselItem } from "@/components/ui/carousel";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import ListItemLoading from "@/components/ui/loading/ListItemLoading";
import { ExpenseStatus } from "@/enums/expenses.enum";
import { InvoiceStatus } from "@/enums/invoice.enum";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IExpense } from "@/interfaces/expenses.interface";
import { IInvoice } from "@/interfaces/invoice.interface";
import { theme } from "@/lib/theme/theme";
import { fetchResource } from "@/services/fetchService";
import { IconCheck, IconCheckbox, IconXboxX } from "@tabler/icons-react";
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
  const [isPayingInvoice, setIsPayingInvoice] = useState(false);
  const [error, setError] = useState<IAPIError | null>(null);

  const t = useTranslations();
  const { toast } = useToast();

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

  const areTherePendingExpenses =
    expenses.length > 0
      ? expenses.some((expense) => expense.status === ExpenseStatus.PENDING)
      : false;

  const isInvoiceClosedOrDelayed = [
    InvoiceStatus.CLOSED,
    InvoiceStatus.DELAYED,
  ].includes(invoice.status);

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

  const handlePayInvoice = async () => {
    try {
      setIsPayingInvoice(true);

      const { data, error } = await payInvoice(invoice.id);

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      toast({
        title: t("utils.success"),
        description: data?.message,
        action: <IconCheckbox className="w-6 h-6" color="#86EFAC" />,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "erro",
          description: error.message,
          action: (
            <IconXboxX className="w-6 h-6" color={theme.colors.red[500]} />
          ),
        });
      }
    } finally {
      setIsPayingInvoice(false);
    }
  };

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
                <div className="w-full flex flex-col">
                  {expenses.map((expense, index) => {
                    return (
                      <ExpenseSummarizedItem
                        key={expense.id}
                        expense={expense}
                        locale={locale}
                        index={index}
                      />
                    );
                  })}

                  {(areTherePendingExpenses || isInvoiceClosedOrDelayed) && (
                    <div className="mt-5 w-full md:w-fit self-end">
                      <Button
                        type="button"
                        color="secondary"
                        text={
                          isInvoiceClosedOrDelayed
                            ? t("creditCard.payInvoice")
                            : t("expenses.payAllExpenses")
                        }
                        trailing={<IconCheck />}
                        onClick={handlePayInvoice}
                        isLoading={isPayingInvoice}
                        disabled={isPayingInvoice}
                        fullWidth
                        extraRounded
                        small
                      />
                    </div>
                  )}
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
