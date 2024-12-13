"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import { FC, Fragment, useState } from "react";
import Card from "../ui/card/Card";
import {
  IconChevronLeft,
  IconCreditCard,
  IconEdit,
  IconX,
} from "@tabler/icons-react";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import IconButton from "../ui/button/IconButton";
import { useRouter } from "next-nprogress-bar";
import CreditCardForm from "../forms/creditCardForm/CreditCardForm";
import Invoices from "./invoices/Invoices";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { createCreditCardSummary } from "@/utils/creditCards/createCreditCardSummary";
import InvoiceBar from "./invoices/InvoiceBar";
import Divider from "../ui/divider/Divider";
import Subscriptions from "../subscriptions/Subscriptions";

interface IProps {
  creditCard?: ICreditCard;
  error?: IAPIError;
  locale: string;
}

const CreditCardDetails: FC<IProps> = ({ creditCard, error, locale }) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const t = useTranslations();

  const updateIsEditing = (isEditing: boolean) => setIsEditing(isEditing);

  const creditCardSummary = creditCard
    ? createCreditCardSummary(creditCard)
    : undefined;
  const availableLimit = creditCardSummary
    ? creditCardSummary.limit -
      creditCardSummary.closedTotal -
      creditCardSummary.currentMonthInvoiceTotal -
      creditCardSummary.otherMonthsTotal
    : undefined;

  return (
    <Fragment>
      <Card
        title={creditCard?.nickname ?? ""}
        translateTitle={false}
        icon={<IconCreditCard />}
        action={
          <div className="flex items-center gap-2">
            {isEditing ? (
              <IconButton
                type="button"
                color="error"
                icon={<IconX />}
                onClick={() => updateIsEditing(false)}
              />
            ) : (
              <IconButton
                type="button"
                color="info"
                icon={<IconEdit />}
                onClick={() => updateIsEditing(true)}
              />
            )}

            <IconButton
              type="button"
              color="secondary"
              variant="outlined"
              icon={<IconChevronLeft />}
              onClick={() => router.push("/credit-cards")}
            />
          </div>
        }
      >
        {error ? (
          <ErrorDisplay errorMessage={error.errorMessage} />
        ) : (
          <Fragment>
            {isEditing ? (
              <CreditCardForm
                creditCard={creditCard}
                error={error}
                updateIsEditing={updateIsEditing}
              />
            ) : (
              <div>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 p-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-base md:text-2xl font-bold">
                      {t("creditCard.bank")}
                    </p>

                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src={`/images/logos/${creditCard?.bank}.png`}
                        width={512}
                        height={512}
                        alt={`${creditCard?.bank} logo`}
                        className="w-6 h-6 rounded-full"
                      />

                      <p>{creditCard?.bank}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-base md:text-2xl font-bold">
                      {t("creditCard.limit")}
                    </p>

                    <p>
                      {Number(creditCard?.limit).toLocaleString(locale, {
                        style: "currency",
                        currency: locale === "pt" ? "BRL" : "USD",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-base md:text-2xl font-bold">
                      {t("creditCard.closingDay")}
                    </p>

                    <p>{creditCard?.closingDay}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-base md:text-2xl font-bold">
                      {t("creditCard.dueDay")}
                    </p>

                    <p>{creditCard?.dueDay}</p>
                  </div>
                </div>

                <Divider />

                {creditCard && (
                  <div className="my-2 p-4">
                    <p className="text-lg md:text-2xl font-bold mb-4">
                      {t("creditCard.invoicesSummary")}
                    </p>

                    <InvoiceBar
                      creditCard={creditCardSummary!}
                      locale={locale}
                    />

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-4">
                      {creditCardSummary &&
                        creditCardSummary.closedTotal > 0 && (
                          <div className="flex flex-col">
                            <p className="text-base font-bold italic text-red-500">
                              {t("creditCard.closedInvoice")}
                            </p>

                            <p className="text-red-500">
                              {creditCardSummary.closedTotal.toLocaleString(
                                locale,
                                {
                                  style: "currency",
                                  currency: locale === "pt" ? "BRL" : "USD",
                                }
                              )}
                            </p>
                          </div>
                        )}

                      <div className="flex flex-col">
                        <p className="text-base font-bold italic text-sky-500">
                          {t("creditCard.currentInvoice")}
                        </p>

                        <p className="text-sky-500">
                          {creditCardSummary!.currentMonthInvoiceTotal.toLocaleString(
                            locale,
                            {
                              style: "currency",
                              currency: locale === "pt" ? "BRL" : "USD",
                            }
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-base font-bold italic text-amber-500">
                          {t("creditCard.nextMonths")}
                        </p>

                        <p className="text-amber-500">
                          {creditCardSummary!.otherMonthsTotal.toLocaleString(
                            locale,
                            {
                              style: "currency",
                              currency: locale === "pt" ? "BRL" : "USD",
                            }
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-base font-bold italic">
                          {t("creditCard.availableLimit")}
                        </p>

                        <p>
                          {availableLimit!.toLocaleString(locale, {
                            style: "currency",
                            currency: locale === "pt" ? "BRL" : "USD",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Fragment>
        )}
      </Card>

      {creditCard?.invoices && creditCard!.invoices.length > 0 && (
        <Invoices invoices={creditCard!.invoices!} locale={locale} />
      )}

      {creditCard &&
        creditCard.subscriptions &&
        creditCard.subscriptions.length > 0 && (
          <div className="mt-5">
            <Subscriptions
              locale={locale}
              error={error}
              initialSubscriptions={creditCard.subscriptions.map((sub) => ({
                ...sub,
                creditCard,
              }))}
              displayFilters={false}
            />
          </div>
        )}
    </Fragment>
  );
};

export default CreditCardDetails;
