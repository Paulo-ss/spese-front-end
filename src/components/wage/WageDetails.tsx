"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { IWage } from "@/interfaces/wage.interface";
import { FC, useState } from "react";
import Card from "../ui/card/Card";
import {
  IconCash,
  IconChevronLeft,
  IconEdit,
  IconX,
} from "@tabler/icons-react";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { Fade } from "react-awesome-reveal";
import IconButton from "../ui/button/IconButton";
import { useTranslations } from "next-intl";
import WageForm from "../forms/wage/WageForm";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";

interface IProps {
  wage?: IWage;
  error?: IAPIError;
  locale: string;
}

const WageDetails: FC<IProps> = ({ wage, error, locale }) => {
  const t = useTranslations();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      title="yourWage"
      icon={<IconCash />}
      action={
        <div className="flex items-center gap-2">
          {isEditing ? (
            <IconButton
              type="button"
              color="error"
              icon={<IconX />}
              onClick={() => setIsEditing(false)}
            />
          ) : (
            <IconButton
              type="button"
              color="info"
              icon={<IconEdit />}
              onClick={() => {
                setIsEditing(true);
              }}
            />
          )}

          <IconButton
            type="button"
            color="secondary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/wage")}
          />
        </div>
      }
    >
      {error || !wage ? (
        <ErrorDisplay
          errorMessage={error ? error.errorMessage : "utils.somethingWentWrong"}
        />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          {isEditing ? (
            <WageForm
              wage={wage}
              error={error}
              updateIsEditing={(isEditing: boolean) => setIsEditing(isEditing)}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:gap-8 p-4">
              {wage.bankAccount && (
                <div className="col-span-1 flex flex-col gap-3">
                  <p className="text-base md:text-2xl font-bold">
                    {t("expenses.bankAccount")}
                  </p>

                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={`/images/logos/${wage?.bankAccount?.bank}.png`}
                      width={512}
                      height={512}
                      alt={`${wage?.bankAccount?.bank} logo`}
                      className="w-6 h-6 rounded-full"
                    />

                    <p>{wage?.bankAccount?.bank}</p>
                  </div>
                </div>
              )}

              <div className="col-span-1 flex flex-col gap-3">
                <p className="text-base md:text-2xl font-bold">
                  {t("wagePrice")}
                </p>

                <p>
                  {Number(wage?.wage).toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>

              <div className="col-span-1 flex flex-col gap-3">
                <p className="text-base md:text-2xl font-bold">
                  {t("paymentDay")}
                </p>

                <p>{wage.paymentDay}</p>
              </div>

              {wage.businessDay && (
                <div className="col-span-1 flex flex-col gap-3">
                  <p className="text-base md:text-2xl font-bold">
                    {t("businessDay")}
                  </p>

                  <p>{t(`${wage.businessDay}`)}</p>
                </div>
              )}
            </div>
          )}
        </Fade>
      )}
    </Card>
  );
};

export default WageDetails;
