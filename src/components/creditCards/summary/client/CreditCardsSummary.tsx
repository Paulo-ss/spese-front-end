"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import { IAPIError } from "@/interfaces/api-error.interface";
import { ICreditCardSummary } from "@/interfaces/credit-card.interface";
import {
  IconChevronRight,
  IconClipboardOff,
  IconCreditCard,
  IconPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { FC, Fragment } from "react";
import InvoiceBar from "../../invoices/InvoiceBar";

interface IProps {
  creditCards?: ICreditCardSummary[];
  error?: IAPIError;
  locale: string;
}

const CreditCardsSummary: FC<IProps> = ({ creditCards, error, locale }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card
      title="creditCard.yourCreditCards"
      icon={<IconCreditCard />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/credit-cards/create")}
          />

          {!pathname.includes("credit-cards") && (
            <IconButton
              type="button"
              color="secondary"
              variant="outlined"
              icon={<IconChevronRight />}
              onClick={() => router.push("/credit-cards")}
            />
          )}
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fragment>
          {creditCards && creditCards.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {creditCards!.map((creditCard) => {
                return (
                  <div key={creditCard.id} className="flex flex-col gap-3 p-2">
                    <Link href={`/credit-cards/${creditCard.id}`}>
                      <div className="p-2 flex items-center gap-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10">
                            <Image
                              src={`/images/logos/${creditCard.bank}.png`}
                              width={512}
                              height={512}
                              alt={`${creditCard.bank} logo`}
                              className="overflow-hidden rounded-full"
                            />
                          </div>
                        </div>

                        <div className="grow flex items-end gap-2">
                          <div className="flex flex-col">
                            <p className="text-base font-bold">
                              {creditCard.nickname} {creditCard.lastFourDigits}
                            </p>

                            <p className="text-base md:text-lg font-bold">
                              {(
                                creditCard.closedTotal +
                                creditCard.currentMonthInvoiceTotal +
                                creditCard.otherMonthsTotal
                              ).toLocaleString(locale, {
                                style: "currency",
                                currency: locale === "pt" ? "BRL" : "USD",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-base">
                            {t("creditCard.closes")} {creditCard.closingDate}
                          </p>

                          <p className="text-base md:text-lg font-bold">
                            {Number(creditCard.limit).toLocaleString(locale, {
                              style: "currency",
                              currency: locale === "pt" ? "BRL" : "USD",
                            })}
                          </p>
                        </div>

                        <IconChevronRight />
                      </div>
                    </Link>

                    <InvoiceBar creditCard={creditCard} locale={locale} />
                  </div>
                );
              })}
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default CreditCardsSummary;
