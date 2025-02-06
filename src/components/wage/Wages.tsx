"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import { IconClipboardOff, IconCoin, IconPlus } from "@tabler/icons-react";
import { FC, Fragment } from "react";
import Card from "../ui/card/Card";
import IconButton from "../ui/button/IconButton";
import { useRouter } from "next-nprogress-bar";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { useTranslations } from "next-intl";
import { IWage } from "@/interfaces/wage.interface";
import WageItem from "./WageItem";

interface IProps {
  wages?: IWage[];
  locale: string;
  error?: IAPIError;
}

const Wages: FC<IProps> = ({ wages, error, locale }) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Card
      title="yourWages"
      icon={<IconCoin />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/wage/create")}
          />
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fragment>
          {!wages || (wages && wages.length === 0) ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-2">
                {wages?.map((wage) => (
                  <WageItem key={wage.id} wage={wage} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Wages;
