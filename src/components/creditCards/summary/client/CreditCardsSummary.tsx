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
import { useRouter } from "next/navigation";
import { FC, Fragment } from "react";

interface IProps {
  creditCards?: ICreditCardSummary[];
  error?: IAPIError;
  locale: string;
}

const CreditCardsSummary: FC<IProps> = ({ creditCards, error, locale }) => {
  const t = useTranslations();
  const router = useRouter();

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

          <IconButton
            type="button"
            color="secondary"
            variant="outlined"
            icon={<IconChevronRight />}
            onClick={() => router.push("/credit-cards")}
          />
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
            <Fragment>
              {creditCards!.map((creditCard) => (
                <div
                  key={creditCard.id}
                  className="p-2 flex items-center gap-3"
                >
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
                        {creditCard.nickname}
                      </p>

                      <p className="text-lg">
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

                    <div className="relative rounded-3xl h-4 w-full bg-zinc-100 dark:bg-zinc-800 mb-1">
                      <div className="absolute top-0 bg-emerald-500 h-4 w-20 mb-1 rounded-3xl"></div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-base font-bold">
                      {t("creditCard.closes")}{" "}
                      {new Date(creditCard.closingDate).toLocaleDateString(
                        locale,
                        { day: "2-digit", month: "2-digit" }
                      )}
                    </p>

                    <p className="text-lg">
                      {Number(creditCard.limit).toLocaleString(locale, {
                        style: "currency",
                        currency: locale === "pt" ? "BRL" : "USD",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </Fragment>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default CreditCardsSummary;
