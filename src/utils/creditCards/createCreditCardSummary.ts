import {
  ICreditCard,
  ICreditCardSummary,
} from "@/interfaces/credit-card.interface";
import { InvoiceStatus } from "@/enums/invoice.enum";

const createCreditCardSummary = (
  creditCard: ICreditCard
): ICreditCardSummary => {
  const currentInvoice = creditCard.invoices?.find(
    (invoice) => invoice.status === InvoiceStatus.OPENED_CURRENT
  );

  const otherMonthsTotal = creditCard.invoices
    ? creditCard.invoices.reduce((total, invoice) => {
        if (invoice.status === InvoiceStatus.OPENED_FUTURE) {
          return total + Number(invoice.currentPrice);
        }

        return total;
      }, 0)
    : 0;

  const closedTotal = creditCard.invoices
    ? creditCard.invoices.reduce((total, invoice) => {
        if (invoice.status === InvoiceStatus.CLOSED) {
          return total + Number(invoice.currentPrice);
        }

        return total;
      }, 0)
    : 0;

  const currentMonthInvoiceTotal = currentInvoice
    ? Number(currentInvoice?.currentPrice)
    : 0;

  return {
    bank: creditCard.bank,
    id: creditCard.id,
    nickname: creditCard.nickname,
    limit: creditCard.limit,
    currentMonthInvoiceTotal,
    closedTotal,
    otherMonthsTotal,
    closingDate: "",
    dueDate: "",
    lastFourDigits: creditCard.lastFourDigits,
  };
};

export { createCreditCardSummary };
